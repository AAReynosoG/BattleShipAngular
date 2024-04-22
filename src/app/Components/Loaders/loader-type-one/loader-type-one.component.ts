import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loader-type-one',
  standalone: true,
  imports: [],
  templateUrl: './loader-type-one.component.html',
  styleUrl: './loader-type-one.component.css'
})
export class LoaderTypeOneComponent {
  @Input() text: string = 'Loading...';
}
