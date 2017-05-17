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
export class ChannelApi {

    constructor(public http: Http) {

    }

    
//获取频道列表，传入对应的搜索条件
public list(search_condition_json, showLoadingModal:boolean=true) {
        var url = ApiConfig.getApiUrl()+"channel/list";
        var headers = ApiConfig.GetHeader(url, search_condition_json);
        let options = new RequestOptions({ headers: headers });
        let body=ApiConfig.ParamUrlencoded(search_condition_json);


        let loading: Loading=null;
        if(showLoadingModal){
          loading = ApiConfig.GetLoadingModal();
        }

        return this.http.post(url, body, options).toPromise()
            .then((res) => {
                if(ApiConfig.DataLoadedHandle("channel/list",search_condition_json,res)){
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
                return ApiConfig.ErrorHandle("channel/list",search_condition_json,err);
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
                var url = ApiConfig.getApiUrl() + "channel/list";
                var headers = ApiConfig.GetHeader(url, {"lastupdatecalltime":calltime});
                let options = new RequestOptions({ headers: headers });
                let body = ApiConfig.ParamUrlencoded({"lastupdatecalltime":calltime});
                try {
                    var ret = ost.http.post(url, body, options).toPromise()
                        .then(res => {
						
							if(ApiConfig.DataLoadedHandle("channel/list",search_condition_json,res)==false){
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
        return "channel";
    }

    public static CreateTable = false;
    public createTable() {
        if (ChannelApi.CreateTable == false) {
            DBHelper.GetInstance().createTable(this.tableName(), this.tableColumns());
            ChannelApi.CreateTable = true;
        }
    }

    public tableColumns() {
        var columns = {};
    columns["seq"] = "int";//排序
    columns["channeltype_id"] = "int";//频道类型
    columns["channeltype_id_name"] = "varchar";//频道类型
    columns["name"] = "varchar";//名称
    columns["is_default"] = "varchar";//默认有
    columns["is_must"] = "varchar";//必须的
    columns["status"] = "varchar";//状态
    columns["status_name"] = "varchar";//状态
        return columns;
    }

    

//获取演讲详情, 传入对应的id
public get(id, showLoadingModal:boolean=true) {
        var url = ApiConfig.getApiUrl()+'speech/get';
        let json={ 'id' : id };
        var headers = ApiConfig.GetHeader(url, json);
        let options = new RequestOptions({ headers: headers });
        let body=ApiConfig.ParamUrlencoded(json);


        let loading: Loading=null;
        if(showLoadingModal){
          loading = ApiConfig.GetLoadingModal();
        }

        return this.http.post(url, body, options).toPromise()
            .then((res) => {
              if(ApiConfig.DataLoadedHandle('speech/get',json,res)){
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
                return ApiConfig.ErrorHandle('speech/get',json,err);
            });

        
    }



    

}
