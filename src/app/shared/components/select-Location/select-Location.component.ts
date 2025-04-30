import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LocationService } from '../../service/LocationService';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-select-Location',
  templateUrl: './select-Location.component.html',
  styleUrls: ['./select-Location.component.css'],
  imports: [NgIf, FormsModule],
  standalone: true
})
export class SelectLocationComponent implements AfterViewInit {

  location: { latitude: number; longitude: number } | null = null;
  error: string | null = null;
  private map!: L.Map;
  private Lo: any = null;
  constructor(private locationService: LocationService) { }

  ngAfterViewInit(): void {
    // Ensure that the code runs only in the browser
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {

        // Initialize the map
        this.Lo = L
        this.map = L.map('map').setView([0, 0], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Locate user's position
        this.map.locate({ setView: true, maxZoom: 16 });

        // Handle location found
        this.map.on('locationfound', (e: any) => {
          const radius = e.accuracy;

          // Add a marker to the user's location
          L.marker(e.latlng)
            .addTo(this.map)
            .bindPopup(`You are within ${radius.toFixed(2)} meters from this point.`)
            .openPopup();

          // Add a circle around the user's location
          L.circle(e.latlng, { radius }).addTo(this.map);
        });

        // Handle location error
        this.map.on('locationerror', (e: any) => {
          alert(`Location access denied: ${e.message}`);
        });
      });
    }
  }

  getLocation() {
    this.locationService.getCurrentLocation()
      .then((position) => {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        // Add a marker at the desired position
        if (this.Lo) {

          const marker = this.Lo.marker([this.location.latitude, this.location.longitude]).addTo(this.map); // Example coordinates for Cairo
          marker.bindPopup('المكان المحدد').openPopup();

        }
        this.error = null;
      })
      .catch((err) => {
        this.error = typeof err === 'string' ? err : 'Unable to fetch location';
        this.location = null;
      });
  }
  test() {
    if (this.Lo && this.location && typeof window !== 'undefined') {
      const marker = this.Lo.marker([this.location.latitude, this.location.longitude]).addTo(this.map); // Example coordinates for Cairo

      marker.bindPopup('المكان المحدد').openPopup();
    }
  }
}
