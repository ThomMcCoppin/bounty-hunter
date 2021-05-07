import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader'
import { api_key } from './google_maps_api_key'

//object destructuring
// const geolocation = Plugins.Geolocation;
const { Geolocation } = Plugins;

declare var google

@Component({
  selector: 'app-bounty-active',
  templateUrl: './bounty-active.page.html',
  styleUrls: ['./bounty-active.page.scss'],
})
export class BountyActivePage implements OnInit {
  @ViewChild('mapCanvas', {static:true}) mapElement: ElementRef; //angulars version of document.getElementById

  public map : any

  public userLocation : any
  public bountyLocation : any = {
    longitude: -96.48551643104416,
    latitude: 41.44382793937536
  }
  private userLocationObject: any;
  private watcherId: string;
  private userRawPosition: any = {
    coords: {}
  }
  private userMarker: any;
  private bountyCircle: any;


  constructor(private router: Router) { }

  ngOnInit() {
    const loader = new Loader({
      apiKey: api_key,
      version: "weekly",
      libraries: ['geometry'],
    });

    loader.load().then( () => {

      this.loadMap();

    }).then( () => {

      this.watchLocation();

    })

  }

  loadMap() {

    return Geolocation.getCurrentPosition().then( position => {
      console.log("geolocation: ", position);
      //users current position
      this.userLocationObject = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

      const mapOptions = {
        zoom: 14,
        center: this.userLocationObject
      }

      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        mapOptions
      )

      return Promise.resolve()

      // //marker for users current position
      // const userMarker = new google.maps.Marker({
      //   map: this.map,
      //   position: userLocationObject,
      //   animation: google.maps.Animation.DROP
      // })

      // //41.44382793937536, -96.48551643104416 for bounty
      // const bountyLocationObject = new google.maps.LatLng(this.bountyLocation.latitude, this.bountyLocation.longitude)

      // // const bountyMarker = new google.maps.Marker({
      // //   map: this.map,
      // //   position: bountyLocationObject,
      // //   animation: google.maps.Animation.DROP
      // // })

      // const distanceToBounty = Math.round(
      //   google.maps.geometry.spherical.computeDistanceBetween(userLocationObject, bountyLocationObject)
      //   );

      // console.log("bounty distance:", distanceToBounty);

      // let radius
      // //calculate size of radius
      // if (distanceToBounty > 1000) {
      //   radius = 500;
      // }
      // else if (distanceToBounty <= 1000 && distanceToBounty > 500) {
      //   radius = 250;
      // }
      // else if (distanceToBounty <= 500 && distanceToBounty > 100){
      //   radius = 100;
      // }
      // else {
      //   radius = 25;
      // }

      // const bountyCircle = new google.maps.Circle({
      //   strokeColor: "#FF0000",
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillColor: "#FF0000",
      //   fillOpacity: 0.35,
      //   map: this.map,
      //   center: bountyLocationObject,
      //   radius
      // });

    })
}

  watchLocation() {
    console.log("fill me in bruv");

    const positionOptions = {
      maximumAge: 0,
      enableHighAccuracy: false
    }

    this.watcherId = Geolocation.watchPosition(positionOptions, (position) => {
      console.log('got watched position', position);

      if ( 
        !position ||
        !position.coords ||
        (this.userRawPosition.coords.latitude === position.coords.latitude &&
        this.userRawPosition.coords.longitude === position.coords.longitude)
      ) {
        console.log("same location, skipping", this.userRawPosition, position)
        return false;
      } 
      
      this.userRawPosition = position;

      console.log("position: ", position);

      this.updateUserLocation();
      this.updateBountyCircle();
    })
  }

  goToBountyClaim() {
    this.router.navigateByUrl('/bounty-claim')
  }

  updateUserLocation() {
  this.userLocationObject = new google.maps.LatLng(
    this.userRawPosition.coords.latitude,
    this.userRawPosition.coords.longitude
  )

  if(this.userMarker) this.userMarker.setMap(null);
  this.userMarker = new google.maps.marker({
    map: this.map,
    position: this.userLocationObject,
    animation: google.maps.Animation.DROP
  })
}

  updateBountyCircle() {
      const bountyLocationObject = new google.maps.LatLng(this.bountyLocation.latitude, this.bountyLocation.longitude)

      // const bountyMarker = new google.maps.Marker({
      //   map: this.map,
      //   position: bountyLocationObject,
      //   animation: google.maps.Animation.DROP
      // })

      const distanceToBounty = Math.round(
        google.maps.geometry.spherical.computeDistanceBetween(this.userLocationObject, bountyLocationObject)
        );

      console.log("bounty distance:", distanceToBounty);

      let radius
      //calculate size of radius
      if (distanceToBounty > 1000) {
        radius = 500;
      }
      else if (distanceToBounty <= 1000 && distanceToBounty > 500) {
        radius = 250;
      }
      else if (distanceToBounty <= 500 && distanceToBounty > 100){
        radius = 100;
      }
      else {
        radius = 25;
      }

      if (this.bountyCircle) this.bountyCircle.setMap(null);

      this.bountyCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
        center: bountyLocationObject,
        radius
      });
  }
}