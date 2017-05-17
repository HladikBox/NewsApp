import { Injectable } from '@angular/core';
import { LoadingController, Loading} from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import { ApiConfig,DBHelper } from '../app/api.config'

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/*
  Generated class for the Test provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChanneltypeApi {

    constructor(public http: Http) {

    }

    
//获取频道类型列表，传入对应的搜索条件
public list(search_condition_json, showLoadingModal:boolean=true) {
        var url = ApiConfig.getApiUrl()+"channeltype/list";
        var headers = ApiConfig.GetHeader(url, search_condition_json);
        let options = new RequestOptions({ headers: headers });
        let body=ApiConfig.ParamUrlencoded(search_condition_json);


        let loading: Loading=null;
        if(showLoadingModal){
          loading = ApiConfig.GetLoadingModal();
        }

        return this.http.post(url, body, options).toPromise()
            .then((res) => {
                if(ApiConfig.DataLoadedHandle("channeltype/list",search_condition_json,res)){
                  if(showLoadingModal){
                     ApiConfig.DimissLoadingModal();
                  }
              
                 return res.json();
              }else{
                return Promise.reject(res);
              }
            })
            .catch(err => {
                if(showLoadingModal){
					           ApiConfig.DimissLoadingModal();
                }
                return ApiConfig.ErrorHandle("channeltype/list",search_condition_json,err);
            });

        
    }


//先从服务器中同步数据到本地数据库，再从本地数据库中搜索数据
public listInDB(search_condition_json, callback, showLoadingModal:boolean=true) {
    
    var db = DBHelper.GetInstance();
    if (db.isDBReady() == false) {
        this.list(search_condition_json).then(data => {
            callback(data);
        });
        return;
    }
        var ost = this;
        this.createTable();

        let loading: Loading=null;
        if(showLoadingModal){
          loading = ApiConfig.GetLoadingModal();
        }

        try {
            db.getLastestUpdatedTime(this.tableName(), function (calltime) {
                //alert(calltime);
                var url = ApiConfig.getApiUrl() + "channeltype/list";
                var headers = ApiConfig.GetHeader(url, {"lastupdatecalltime":calltime});
                let options = new RequestOptions({ headers: headers });
                let body = ApiConfig.ParamUrlencoded({"lastupdatecalltime":calltime});
                try {
                    var ret = ost.http.post(url, body, options).toPromise()
                        .then(res => {
						
							if(ApiConfig.DataLoadedHandle("channeltype/list",search_condition_json,res)==false){
								return;
							}
                            var data = res.json();
                            try {
                                DBHelper.GetInstance().batchUpdate(ost.tableName(), ost.tableColumns(), data, function () {
                                  if(showLoadingModal){
                                    ApiConfig.DimissLoadingModal();
                                  }
                                        
                                    DBHelper.GetInstance().updateLastestCallTime(ost.tableName());
                                    ost.query(search_condition_json, callback);
                                });
                            } catch (ex) {
                                  if(showLoadingModal){
                                    ApiConfig.DimissLoadingModal();
                                  }
                                ost.query(search_condition_json, callback);
                            }
                        })
                        .catch(err => {
                                  if(showLoadingModal){
                                    ApiConfig.DimissLoadingModal();
                                  }
                            ost.query(search_condition_json, callback);
                        });
                } catch (err){
                                  if(showLoadingModal){
                                    ApiConfig.DimissLoadingModal();
                                  }
                }
            });
        } catch (ex){
                                  if(showLoadingModal){
                                    ApiConfig.DimissLoadingModal();
                                  }
            this.query(search_condition_json, callback);
        }
}

    public query(condition, callback) {
		
		var db = DBHelper.GetInstance();
		if (db.isDBReady() == false) {
			this.list(condition).then(data => {
				callback(data);
			});
			return;
		}
		
		
        this.createTable();
        var sql = "select * from " + this.tableName() + " where 1=1 ";
        var searchdata = new Array();
        for (let i in condition) {
            var columns = this.tableColumns();
            var coltype = columns[i];
            if (coltype == "varchar") {
                sql += " and " + i + " like ?";
                searchdata.push(condition[i]);
            } else if (coltype=="int") {
                sql += " and " + i + " = ?";
                searchdata.push(condition[i]);
            }
        }
        if (condition["orderby"] != null && condition["orderby"] != "") {
            sql += " order by "+condition["orderby"];
        }

        DBHelper.GetInstance().query(sql, searchdata, callback);
    }

    public tableName() {
        return "channeltype";
    }

    public static CreateTable = false;
    public createTable() {
        if (ChanneltypeApi.CreateTable == false) {
            DBHelper.GetInstance().createTable(this.tableName(), this.tableColumns());
            ChanneltypeApi.CreateTable = true;
        }
    }

    public tableColumns() {
        var columns = {};
    columns["seq"] = "int";//排序
    columns["name"] = "varchar";//名称
    columns["status"] = "varchar";//状态
    columns["status_name"] = "varchar";//状态
        return columns;
    }





    

}
