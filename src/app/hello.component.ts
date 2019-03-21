import { Component, Input, OnInit, NgZone } from '@angular/core';

import {
  tileLayer, latLng, MapOptions, geoJSON,
  circle, polygon,
  marker, latlng, Layer, popup, icon,
  Map,
} from 'leaflet';

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html',
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent implements OnInit {
  @Input() name: string;

  private map: Map;
  private popup: popup = popup();
  public options: MapOptions = null;
  public layersControl = null;
  private userMarker: marker = null;
  public layers: Layer[] = [
    circle([12.9748534, 77.627675], { radius: 5000 }),
    polygon([[11.9748534, 75.627675], [15.9748534, 77.927675], [15.9748534, 78.627675]]),
    // marker([12.9748534, 77.627675], { icon: this.getIcon() })
  ];

  public geojsonFeature = {
    "type": "Feature",
    "properties": {
      "name": "Coors Field",
      "amenity": "Baseball Stadium",
      "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [-104.99404, 39.75621]
    }
  };

  constructor(private zone: NgZone) {

  }

  /**
   * @ description:Listener for click event onmap 
   */
  public clicked(event: any): void {
    this.popup
      .setLatLng(event.latlng)
      .setContent("You clicked the map at " + event.latlng.toString())
      .openOn(this.map);
    // const mark = this.getMark(event.latlng.lat, event.latlng.lng);
    // this.layers.push(mark);
  }

  private getIcon(): icon {
    return icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/peppyicons/512/660011-location-512.png'
    });
  }

  public onMapReady(map: Map) {
    this.map = map;
    this.map.locate({ setView: true, watch: true, zoom: 8,enableHighAccuracy:true });
    // this.map.on('locationfound', (e: any) => {
    //   this.zone.run(() => this.onLocationFound(e));
    // });
    // or
    this.map.on('locationfound', this.onLocationFound.bind(this));
    map.on('locationerror', this.onLocationError.bind(this));
  }


  private onLocationFound(e: any) {
    const { lat, lng } = e.latlng;
    console.log(lat, lng);
    this.options.center = [lat, lng];
    if (this.userMarker) {
      console.log('Updating the marker');
      this.userMarker.setLatLng(e.latlng);
    } else {
       this.userMarker = this.getMark(lat, lng).bindPopup('You are here').openPopup();
      this.layers.push(this.userMarker);
    }
  }

  private onLocationError(e: any) {
    console.log(e);
    alert(e.message || 'something is wrong');
  }

  private getMark(lat, lng): marker {
    return marker(latLng(lat, lng), {
      icon: this.getIcon(),
    });
  }

  ngOnInit() {
    // this.userMarker = this.getMark(0, 0).bindPopup('You are here').openPopup();

    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' })
      ],
      zoom: 0,
      center: [0, 0],
    };

    this.layersControl = {
      baseLayers: {
        'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        'Open Satellite Map': tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 25,
          zoom: 22,
          id: 'mapbox.satellite',
          accessToken: 'pk.eyJ1IjoibWFuanVuYXRobWFudSIsImEiOiJjamxtNXh1cTMxNHo3M2psZDdzODl6OGVwIn0.y_SHiU_Zrn-Y5-1ZgJ9ptQ'
        })
      },
      overlays: {
        'Big Circle': circle([46.95, -122], { radius: 5000 }),
        'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
      }
    }
  }
}
