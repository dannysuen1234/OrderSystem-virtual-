#!/usr/bin/env python

import rospy
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal

mission = [["a", (3, 5)]]
curr_state = [["a", (1.2, 3.3)]]
pending = []
movable_threshold = 1 
finish_threshold = 0.5

def movebase_client():

    client = actionlib.SimpleActionClient('mir/move_base',MoveBaseAction)
    client.wait_for_server()

    goal = MoveBaseGoal()
    goal.target_pose.header.frame_id = "map"
    goal.target_pose.header.stamp = rospy.Time.now()
    goal.target_pose.pose.position.x = 0.5
    goal.target_pose.pose.orientation.w = 1.0

    client.send_goal(goal)
    wait = client.wait_for_result()
    if not wait:
        rospy.logerr("Action server not available!")
        rospy.signal_shutdown("Action server not available!")
    else:
        return client.get_result()

def distance (x1, y1, x2, y2):
	return ((x1-x2)**2+(y1-y2)**2)**0.5

def find_mission(mission_list, robot):
	for i in range (len(mission_list)):
		if mission_list[i][0] == robot:
			return i
	return None

def remove_from_list (mission_list, robot):
	if find_mission(mission_list, robot) is None:
		return
	
	mission_robot.pop(find_mission(robot))

def add_mission(mission_list, robot, goal_point):
	remove_from_list(mission_list, robot)
	mission_list.append([robot, goal_point])


def robot_movable (robot_state_list, robot, robot_state, threshold):
	for i in range (len(robot_state_list)):
		if distance(robot_state[0], robot_state[1], robot_state_list[i][1][0], robot_state[i][1][1]) > threshold:
			return False
	
	return True

def update_robot_status():
	pass

def check_robot_status():
	pass

def check_robot_distance():
	pass 

def pending_robot_handler():
	for i in range (len(pending)):
		curr_robot = pending[i][0]

		#add pending robot status update here 
	
		if robot_movable(curr_state, curr_robot, movable_threshold):
			mission_list.append(pending.pop(i))
			#start moving the robot
			print("moving robot ", i)
			

if __name__ == "__main__":
	
	rospy.init_node('movebase_client_py')
	movebase_client()






