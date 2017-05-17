import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { AppBase } from '../../app/app.base';
import { ChannelDao } from '../../providers/channel.dao';

/**
 * Generated class for the NewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-news',
    templateUrl: 'news.html'
})
export class NewsPage extends AppBase {

    constructor(public navCtrl: NavController, public navParams: NavParams, public dao: ChannelDao) {
        super();
    }

    ionViewDidEnter() {
        //alert("db");
        //this.sqlite.create({
        //    name: 'data.db',
        //    location: 'default'
        //})
        //    .then((db: SQLiteObject) => {

        //        alert("dbk");
        //        db.executeSql('select 1 as kk', {})
        //            .then((data) => { alert(data.length); })
        //            .catch(e => console.log(e));


        //    })
        //    .catch(e => alert(e));


        console.log('ionViewDidLoad NewsPage');
        this.dao.sync({}, true).then((data) => {
            alert(JSON.stringify(data));
        });
    }

}
