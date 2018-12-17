import { Component, OnInit } from '@angular/core';
import { ChatService } from '../data-services/chat.service';

@Component({
    selector: 'main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

    constructor(public chatService: ChatService) {}

    ngOnInit(): void {
    }
}
