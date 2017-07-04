import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() headerClick = new EventEmitter<string>();
  @Input() buttons: any;

  constructor() { }

  ngOnInit() {
  }

  emitHeaderEvent(event: string) {
    this.headerClick.emit(event);
  }
}
