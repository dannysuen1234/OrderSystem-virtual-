from datetime import datetime
from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token)
import json

import requests, json
import threading
import time

import socket
HOST = "0.0.0.0"
PORT = 7000


app = Flask(__name__)

# path to SQL lite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['JWT_SECRET_KEY'] = 'secret'

# Database object
db = SQLAlchemy(app)
jwt = JWTManager(app)

# User Table Object
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.id}', '{self.firstname}', '{self.lastname}', '{self.email}', '{self.password}')"

# Customer Table Object
class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(20), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    mobileno = db.Column(db.Integer, nullable=False)
    no_of_guests = db.Column(db.Integer, nullable=False)
    sessionid = db.Column(db.Text, nullable=False)
    tableno = db.Column(db.String(40))
    orders = db.relationship('Order', backref='author', lazy=True)

    def __repr__(self):
        return f"Customer('{self.customer_id}', '{self.customer_name}', '{self.customer_email}', '{self.mobileno}', '{self.no_of_guests}', '{self.tableno}')"

# Order Table Object
class Order(db.Model):
    orderid = db.Column(db.Integer, unique=True, nullable=False, primary_key=True)
    status = db.Column(db.String(30), nullable=False)
    food = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date_ordered = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    tableno = db.Column(db.String(40),nullable=False)
    sessionid = db.Column(db.Text, db.ForeignKey('customer.sessionid'), nullable=False)
    robot_no = db.Column(db.String(40),nullable=False)

    def __repr__(self):
        return f"Order('{self.orderid}', '{self.status}', '{self.food}', '{self.amount}', '{self.tableno}','{self.date_ordered}','{self.sessionid}','{self.robot_no}')"

# Food Table Object
class Food(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
    name = db.Column(db.String(60), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    imagePath = db.Column(db.String(120), nullable=True, default="")

    def __repr__(self):
        return f"Food('{self.id}', '{self.name}', '{self.description}', '{self.amount}', '{self.imagePath}')"

# Robot Table Object
class Robot(db.Model):
    robotid = db.Column(db.Integer, unique=True, nullable=False, primary_key=True)
    robot_name = db.Column(db.String(30), nullable=False, default="New Robot")
    robot_type = db.Column(db.String(30), nullable=False, default="MIR 200")
    robot_control_methoods = db.Column(db.String(30), nullable=False,default="MIR API")
    robot_control_path = db.Column(db.String(30), nullable=True, default="")
    authorization = db.Column(db.String(80), nullable=True, default="")
    status = db.Column(db.String(30), nullable=True, default="Unkown")
    active = db.Column(db.Boolean, nullable=False, default=True)

    def __repr__(self):
        return f"Robot('{self.robotid}', '{self.robot_name}', '{self.robot_control_methoods}', '{self.robot_control_path}','{self.authorization}' ,'{self.status}', '{self.active}')"

#back home page(not in use)
@app.route('/')
def home():
    return render_template('index.html')

# backend to register new user
@app.route('/register', methods=['POST'])
def register():
    user_data = request.get_json()

    new_user = User(
        firstname=user_data['firstname'],
        lastname=user_data['lastname'],
        email=user_data['email'],
        password=user_data['password']
    )

    if User.query.filter_by(email=new_user.email).first():
        return {"error": "Email address already taken"}

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=user_data['email'])
    refresh_token = create_refresh_token(identity=user_data['email'])

    return {
       'email': user_data['email'],
       'access_token': access_token,
       'refresh_token': refresh_token
    }

# backeng check login condition
@app.route('/login', methods=['POST'])
def login():
    user_data = request.get_json()
    current_user = User.query.filter_by(email=user_data['email']).first()

    if not current_user:
        return {"error": "User not in DB. Register as a new user"}

    password = user_data['password']
    if current_user.password == password:
        access_token = create_access_token(identity=user_data['email'])
        refresh_token = create_refresh_token(identity=user_data['email'])
        return {
            'email': current_user.email, 
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    else:
        return {'error': 'Wrong credentials'}

# Create mew food item
@app.route('/menu_create', methods=['POST'])
def menu_create():
    if request.method == 'POST':
        food_data = request.get_json()

        new_food = Food(
            id=food_data["id"],
            name=food_data["name"],
            description=food_data["description"],
            amount=food_data["amount"]
        )

        db.session.add(new_food)
        db.session.commit()

        return 'Done'

# update a spefic food data(by food id) (POST only)
@app.route('/menu_update/<idx>', methods=['POST'])
def menu_update(idx):
    if request.method == 'POST':
        food_data = request.get_json()
        print(food_data)

        data = Food.query.filter_by(id=idx).first()
        data.id = food_data['idx']
        data.name = food_data['name']
        data.description = food_data['description']
        data.amount = food_data['amount']
        data.imagePath = food_data['imagePath']
        db.session.commit()

        return 'Done'

# query a menu item based on food id 
@app.route('/menu_select/<idx>', methods=['POST'])
def menu_select(idx):
    if request.method == 'POST':
        food_selected = Food.query.filter_by(id=idx).first()
        items = { 'id': food_selected.id, 'name': food_selected.name, 'description': food_selected.description, 'amount': food_selected.amount,'imagePath': food_selected.imagePath}

    return jsonify({'food_items': items})

# delete a menu item based on food id 
@app.route('/menu_delete', methods=['POST'])
def menu_delete():
    if request.method == 'POST':
        food_data = request.get_json()
        
        data = Food.query.filter_by(id=food_data[0]['id']).first()
        db.session.delete(data)
        db.session.commit()

        return 'Done'

# return all food item
@app.route('/menu')
def menu():
    food_list = Food.query.all()
    items = []

    for item in food_list:
        items.append({'id': item.id, 'name': item.name, 'description': item.description, 'amount': item.amount, 'imagePath': item.imagePath})

    return jsonify({'food_items': items})

# return all customer details
@app.route('/customer_details', methods=['GET', 'POST'])
def customer_details():
    if request.method == 'POST':
        user_data = request.get_json()
        
        access_token_customer = create_access_token(identity=user_data['email'])
        refresh_token_customer = create_refresh_token(identity=user_data['email'])

        if Customer.query.filter_by(sessionid=access_token_customer).first():
            return {"error": "Session already taking place on another window"}

        new_user = Customer(
            customer_name=user_data['name'],
            customer_email=user_data['email'],
            mobileno=user_data['mobile'],
            no_of_guests=user_data['guests'],
            sessionid=access_token_customer
        )

        db.session.add(new_user)
        db.session.commit()

        return {
            'email': user_data['email'],
            'customer_access_token': access_token_customer,
            'customer_refresh_token': refresh_token_customer
         }
    else:
        user_data = request.get_json()
        sessid = user_data['sessionid']
        customer = Customer.query.filter_by(sessionid=sessid).first()
        food = customer.orders.order_by(desc(customer.orders.date_ordered)).first()
        print(food)


        return jsonify({'customer_details': food})

# ad
@app.route('/add_table/<sessionidx>', methods=['POST'])
def add_table(sessionidx):
    data = request.get_json()
    find_customer = Customer.query.filter_by(sessionid=sessionidx).first()
    find_customer.tableno = data

    db.session.commit()
    
    return 'Done'  


@app.route('/getpayment', methods=['POST'])
def getpayment():
    user_data = request.get_json()
    sessid = user_data['sessionid']
    customer = Customer.query.filter_by(sessionid=sessid).first()
    order = customer.orders[-1]
    food = json.loads(order.food)
    print(type(food))
    print(food, customer.tableno)
    tt = {'id': customer.customer_id, 'name': customer.customer_name, 'food': json.dumps(food), 'tableno': customer.tableno, 'amount': order.amount, 'orderid': order.orderid}
    
    return jsonify({'customer_details': tt})

# delete a order(by order ID)
@app.route('/order_delete', methods=['POST'])
def order_delete():
    if request.method == 'POST':
        order_data = request.get_json()
        
        data = Order.query.filter_by(orderid=order_data[0]['orderid']).first()
        
        db.session.delete(data)
        db.session.commit()
        # robot back to origin pose
        table_no = data.tableno
        data_to_send = str(int(table_no) *-1)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((HOST, PORT))
        s.send(data_to_send.encode())
        
        s.close()
        return 'Done'

#return Order(s)
# IF GET is used
# return all Order
# IF POST is used
# return order by sessionid
@app.route('/order', methods=['GET', 'POST'])
def order_food():
    if request.method == 'GET':
        order_list = Order.query.all()
        items = []

        for item in order_list:
            items.append({'orderid': item.orderid, 'status': item.status, 'food': item.food, 'tableno': item.tableno, 'amount': item.amount, 'datetime': item.date_ordered,'robot_no': item.robot_no})

        #print(items)

        return jsonify({'order_items': items})
    else:
        order_data = request.get_json()
        sessid = order_data['sessionid']
        customer = Customer.query.filter_by(sessionid=sessid).first()

        
        data = Order(
            status='Food is being prepared.',
            food=order_data['food'],
            amount=order_data['grandtotal'],
            tableno=customer.tableno,
            sessionid=sessid
        )

        db.session.add(data)
        db.session.commit()

        return 'Done'

# delete order by sessionid and orderid
@app.route('/order_cancel', methods=['POST'])
def order_cancel():
    data = request.get_json()
    sessionidx = data['sessionid']
    order_id = data['orderid']
    order = Order.query.filter_by(sessionid=sessionidx,orderid=order_id).first()
    db.session.delete(order)
    db.session.commit()
    return 'Done'

# update order status 
@app.route('/update_status/<idx>', methods=['GET', 'POST'])
def update_status(idx):
    
    if request.method == 'POST':
        robotForThisMission=0
        status_update = request.get_json()
        data = Order.query.filter_by(orderid=idx).first()
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((HOST, PORT))
        s.send(data.tableno.encode())
        s.close()

        if (status_update['status'] == "Food is ready.")or (status_update['status'] == "All Robot is Buzy"):
            robotForThisMission = pudu_check_robot(pudu_url)
            print(robotForThisMission)
            if robotForThisMission == -1:
                data.status = "All Robot are Buzy"
            else:
                data.status = status_update['status']
                data.robot_no= robotForThisMission
        else:
            data.status = status_update['status']
        db.session.commit()

        return jsonify({'robotid': robotForThisMission}) 

# Get all robot data
@app.route('/robot')
def robot():
    robot_list = Robot.query.all()
    items = []

    for item in robot_list:
        items.append({'robotid': item.robotid, 'robot_name': item.robot_name, 'robot_type': item.robot_type, 'robot_control_methoods': item.robot_control_methoods, 'robot_control_path': item.robot_control_path, 'status': item.status, 'active': item.active})

    return jsonify({'robot_items': items})

# URL rto PUDU
pudu_url = "http://192.168.0.167:8888"
pudu_robot_id = "" 
pudu_parking_max_x=-1.19
pudu_parking_max_y=-1.36
pudu_parking_min_x=-2.72
pudu_parking_min_x=-2.72

# random Robot to a specfic table or location
@app.route('/robotTo', methods=['GET', 'POST'])
def robotTo():
    if request.method == 'POST':
        status_update = request.get_json()
        if status_update['mission'] == 1:
            print("Robot Going to Table 1")
            pudu_add_mission_table(pudu_robot_id,1)
            pudu_add_mission_parking(pudu_robot_id)
        elif status_update['mission'] == 2:
            print("Robot going to Table 2")
            pudu_add_mission_table(pudu_robot_id,2)
            pudu_add_mission_parking(pudu_robot_id)
        elif status_update['mission'] == 3:
            print("Robot going to Table 3")
            pudu_add_mission_table(pudu_robot_id,3)
            pudu_add_mission_parking(pudu_robot_id)
        elif status_update['mission'] == 4:
            print("Robot going to Table 4")
            pudu_add_mission_table(pudu_robot_id,4)
            pudu_add_mission_parking(pudu_robot_id)
        elif status_update['mission'] == 5:
            print("Robot going to Table 5")
            pudu_add_mission_table(pudu_robot_id,5)
            pudu_add_mission_parking(pudu_robot_id)
        elif status_update['mission'] == 0:
            print("Robot going to Kitchen")
            pudu_add_mission_kitchen(pudu_robot_id)
        elif status_update['mission'] == -1:
            print("Robot going to Picking Area")
            pudu_add_mission_parking(pudu_robot_id)
        else:
            print(status_update)
        return 'Done' 

# specfic robot to a specfic table or location
@app.route('/thisRobotTo', methods=['GET', 'POST'])
def thisRobotTo():
    missionStr = ""
    if request.method == 'POST':
        status_update = request.get_json()
        if status_update['mission'] == 1:
            missionStr= "Robot Going to Table 1"
            pudu_add_mission_table(status_update['robot'],1)
            pudu_add_mission_parking(status_update['robot'])
        elif status_update['mission'] == 2:
            missionStr= "Robot going to Table 2"
            pudu_add_mission_table(status_update['robot'],2)
            pudu_add_mission_parking(status_update['robot'])
        elif status_update['mission'] == 3:
            missionStr= "Robot going to Table 3"
            pudu_add_mission_table(status_update['robot'],3)
            pudu_add_mission_parking(status_update['robot'])
        elif status_update['mission'] == 4:
            missionStr= "Robot going to Table 4"
            pudu_add_mission_table(status_update['robot'],4)
            pudu_add_mission_parking(status_update['robot'])
        elif status_update['mission'] == 5:
            missionStr= "Robot going to Table 5"
            pudu_add_mission_table(status_update['robot'],5)
            pudu_add_mission_parking(status_update['robot'])
        elif status_update['mission'] == 0:
            missionStr= "Robot going to Kitchen"
            pudu_add_mission_kitchen(status_update['robot'])
        elif status_update['mission'] == -1:
            missionStr= "Robot going to Picking Area"
            pudu_add_mission_parking(status_update['robot'])
        else:
            print(status_update) 
        print(missionStr)
        try:
            if status_update['record']:
                if status_update['orderid']:
                    order_id = status_update['orderid']
                    data = Order.query.filter_by(orderid=order_id).first()
                    data.status = missionStr
                    db.session.commit()
        except:
            print("An exception occurred") 



        return 'Done' 

#reset Order to default for testing only
@app.route('/resetOrder', methods=['GET', 'POST'])
def resetOrder():
    if request.method == 'POST':
        Order.query.update({'status':"Food is being prepared.",'robot_no':None})
        db.session.commit()
    return 'Done' 

def withinArea(current_x,current_y,max_x,max_y,min_x,min_y):
    print("X:%.2f(Max:%.2f,Mini:%.2f),Y:%.2f(Max:%.2f,Mini:%.2f)" % (current_x,max_x,min_x,current_y,max_y,min_y))
    if (current_x <= max_x)and(current_x>= min_x):
        if (current_y <= max_y)and(current_x>= min_y):
            print("Within Area")
            return True
    return False


#mir 
mir_ip = '192.168.0.232'
mir_host_link = 'http://'+ mir_ip + '/api/v2.0.0/'

headers = {
    'Content-Type': "application/json",
    'Accept-Language': "en_US",
    'Authorization': "Basic YWRtaW46OGM2OTc2ZTViNTQxMDQxNWJkZTkwOGJkNGRlZTE1ZGZiMTY3YTljODczZmM0YmI4YTgxZjZmMmFiNDQ4YTkxOA==",
    'Host':mir_ip + ":8080",
    'Connection': "keep-alive",
    'Cache-Control': "no-cache"
}

def mir_add_mission_to_quene(guid):
    missions_id = { "mission_id": guid}
    post_mission = requests.post(mir_host_link+'mission_queue',json=missions_id, headers = headers)
    End_Function(post_mission)
    return

#Add  Table 1 Mission to quene
def mir_add_table1_mission_to_quene ():
   missions_id = {"mission_id": "5b2a609b-cb46-11ec-ae87-00012978ed77"}
   post_mission = requests.post(mir_host_link+'mission_queue',json=missions_id, headers = headers)
   End_Function(post_mission)
   return

#Add kitchen Mission to quene
def mir_add_kitchen_mission_to_quene ():
   missions_id = {"mission_id": "5b2a609b-cb46-11ec-ae87-00012978ed77"}
   post_mission = requests.post(mir_host_link+'mission_queue',json=missions_id, headers = headers)
   End_Function(post_mission)
   return

#Add waiting Mission to quene
def mir_add_waiting_mission_to_quene ():
   missions_id = {"mission_id": "5b2a609b-cb46-11ec-ae87-00012978ed77"}
   post_mission = requests.post(mir_host_link+'mission_queue',json=missions_id, headers = headers)
   End_Function(post_mission)
   return

#run when function end
def End_Function(myfunction) :
    print(myfunction)
    return


#PUDU all life
def pudu_check_robot(pudu_adress):
    pudu_url_add_mission = pudu_adress + "/robot/list"
    payload = json.dumps({
        "runtime": True
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", pudu_url_add_mission, headers=headers, data=payload)
    json_response = json.loads(response.text)
    
    # Display Robot status
    for index_robot in range(len(json_response['data'])):
        print("[ID: %2s]Robot Name:%10s, Robot Type: %10s, Power Level: %3s%%" % (json_response['data'][index_robot]['id'],json_response['data'][index_robot]['name'],json_response['data'][index_robot]['model'],json_response['data'][index_robot]['power']))
        print("Robot's Position: X:%6.2f m, Y:%6.2f m, Angle: %6.2f\N{DEGREE SIGN}" % (json_response['data'][index_robot]['pose']['x'],json_response['data'][index_robot]['pose']['y'],json_response['data'][index_robot]['pose']['angle']))
        print("Robot's Status: %10s" % (json_response['data'][index_robot]['state']))
        if (json_response['data'][index_robot]['state']==0):
            if withinArea(float(json_response['data'][index_robot]['pose']['x']),float(json_response['data'][index_robot]['pose']['y']),pudu_parking_max_x,pudu_parking_max_y,pudu_parking_min_x,pudu_parking_min_x):
                print("robot is Free [%d]" % (json_response['data'][index_robot]['id']))
                return json_response['data'][index_robot]['id']
    return -1

# add pudu mission
def pudu_add_mission(pudu_adress,mission_id, robot_id):
    pudu_url_add_mission = pudu_adress + "/task/add"
    payload = json.dumps({
    "missionId": mission_id,
    "robotId": robot_id
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", pudu_url_add_mission, headers=headers, data=payload)

    print(response.text)

#Parking Position for diff. robot
def pudu_add_mission_parking(robot_id):
    if robot_id == 7: #KettyBot1
        pudu_add_mission(pudu_url,44,robot_id)
    elif robot_id == 6: #KettyBot2
        pudu_add_mission(pudu_url,45,robot_id)
    else: #defalut
        pudu_add_mission(pudu_url,44,robot_id)

#robot to kitchen
def pudu_add_mission_kitchen(robot_id):
    #pudu_add_mission(..,X,..) X is mission you may change to other to fit your application
    pudu_add_mission(pudu_url,43,robot_id)

#robot to table
def pudu_add_mission_table(robot_id, table_no):
    if (table_no == 1):
        pudu_add_mission(pudu_url,46,robot_id) #table 1
    elif (table_no == 2):
        pudu_add_mission(pudu_url,47,robot_id) #table 2
    elif (table_no == 3):
        pudu_add_mission(pudu_url,48,robot_id) #table 3
    elif (table_no == 4):
        pudu_add_mission(pudu_url,49,robot_id) #table 4
    elif (table_no == 5):
        pudu_add_mission(pudu_url,50,robot_id) #table 5
    


if __name__ == "__main__":

    print("here")
    db.create_all()

    app.run(debug=True)
    
