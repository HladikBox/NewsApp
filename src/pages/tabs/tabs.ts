import { Component } from '@angular/core';

import { AppBase } from '../../app/app.base';

import { MePage } from "../me/me";
import { NewsPage } from "../news/news";
import { RecommendPage } from "../recommend/recommend";
import { VideoPage } from "../video/video";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage extends AppBase {

    tab1Root = NewsPage;
    tab2Root = RecommendPage;
    tab3Root = VideoPage;
    tab4Root = MePage;

    constructor() {
        super();
    }
}
