import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AbstractDao } from "./dao.abstract";
import { Http, Response } from '@angular/http';
import { ChannelApi } from "./channel.api";

@Injectable()
export class ChannelDao extends AbstractDao {

    constructor(public http: Http, public sqlite: SQLite) {
        super(sqlite, http);
    }

    public tableName(): string {
        return "channel";
    }

    public tableColumns(): Array<string> {
        var columns = new Array();
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

    public list(search_condition, showLoadingModel: boolean) {
        let api: ChannelApi = new ChannelApi(this.http);
        return this.getLastestUpdatedTime().then((updatedate) => {
            return api.list({ "lastupdatecalltime": updatedate }, showLoadingModel).then(data => {
                return this.batchUpdate(data).then(() => {
                    return this.simpleQuery(search_condition);
                });
            });
        }).catch(e => {
            alert("??");
            return api.list(search_condition, showLoadingModel);
        });
    }

}