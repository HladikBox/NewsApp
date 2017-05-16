import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppBase } from '../../app/app.base';

/**
 * Generated class for the NewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-news',
    templateUrl: 'news.html',
})
export class NewsPage extends AppBase {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        super();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewsPage');
    }

}
