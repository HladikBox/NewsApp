import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';

import { TabsPage } from '../pages/tabs/tabs';
import { MePage } from '../pages/me/me';
import { NewsPage } from '../pages/news/news';
import { RecommendPage } from '../pages/recommend/recommend';
import { VideoPage } from '../pages/video/video';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { ChannelDao } from '../providers/channel.dao';

@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        MePage,
        NewsPage,
        RecommendPage,
        VideoPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        TabsPage,
        MePage,
        NewsPage,
        RecommendPage,
        VideoPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        SQLite,
        ChannelDao,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule {}
