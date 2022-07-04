import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


export default function RobotMap (){
  const position = [15, -0.09]
  return(
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>

  )
}