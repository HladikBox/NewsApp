import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http, Response } from '@angular/http';
import { ApiConfig } from "../app/api.config";

export abstract class AbstractDao {

    public databaseName: string = "";

    constructor(public sqlite: SQLite, public http: Http) {
        this.databaseName = ApiConfig.getDataBaseName();
        this.createTable();
    }

    public getDbInstance(): Promise<SQLiteObject> {
        return this.sqlite.create({
            name: this.databaseName,
            location: 'default'
        }).then((db) => { return db })
            .catch(e => console.log(e));
    }

    //create table
    createTable() {
        this.getDbInstance().then((db: SQLiteObject) => {

            db.executeSql("CREATE TABLE IF NOT EXISTS " + this.tableName() + " (id int,updated_date datetime)", {})
                .then(() => {
                    var columns = this.tableColumns();
                    for (let col in columns) {
                        db.executeSql("ALTER TABLE " + this.tableName() + " add column " + col + " " + columns[col], [])
                            .then(() => { }, (err) => { })
                            .catch(e => console.log(e));
                    }
                })
                .catch(e => console.log(e));
        })
            .catch(e => console.log(e));
    }

    public tableName(): string {
        return "";
    }

    public tableColumns(): Array<string> {
        var columns = new Array();
        return columns;
    }

    public getLastestUpdatedTime() {

        return this.getDbInstance()
            .then((db: SQLiteObject) => {
                return db.executeSql("CREATE TABLE IF NOT EXISTS applink_api_lastcall (objname varchar,calltime varchar)", {})
                    .then(() => {
                        return db.executeSql("select calltime from applink_api_lastcall where objname=?", [this.tableName()]).then(data => {

                            if (data.rows.length > 0) {

                                return data.rows.item(0).calltime;
                            } else {
                                var defaultdate = '1970-01-01 00:00:00';
                                db.executeSql("insert into applink_api_lastcall values(?,?)", [this.tableName(), defaultdate]);
                                return defaultdate;
                            }
                        });
                    });
            }).catch(e => console.log(e));
    }

    public updateLatestUpdatedTime() {
        this.getDbInstance()
            .then((db: SQLiteObject) => {
                db.executeSql("update applink_api_lastcall set calltime=datetime('now', 'localtime') where objname=?", [this.tableName()]);
            }).catch(e => console.log(e));
    }

    public batchUpdate(data) {
        var idlist = new Array();
        idlist.push(0);
        for (let i in data) {
            var id = data[i].id;
            idlist.push(id);
        }
        return this.getDbInstance()
            .then((db: SQLiteObject) => {

                return db.executeSql("select id from " + this.tableName() + " where id in (" + idlist.join(",") + ")", [])
                    .then((existsData) => {
                        var dao = this;
                        return db.transaction(function (tx) {
                            for (let i in data) {
                                var id = data[i].id;
                                var isexists = false;
                                for (var c = 0; c < existsData.rows.length; c++) {
                                    if (id == existsData.rows.item(c).id) {
                                        isexists = true;
                                        break;
                                    }
                                }
                                var preUpdateObj = null;
                                if (isexists) {
                                    preUpdateObj = dao.preUpdateSql(data[i]);
                                } else {
                                    preUpdateObj = dao.preInsertSql(data[i]);
                                }
                                tx.executeSql(preUpdateObj.sql, preUpdateObj.param);
                            }
                        }).then(ret => {
                        }).catch(ex => {
                            console.log(ex);
                        });
                    });

            }).catch(e => console.log(e));
    }

    public preUpdateSql(data) {
        var param = [];

        var sql = "update " + this.tableName() + " set updated_date=datetime('now', 'localtime') ";
        var columns = this.tableColumns();
        for (let col in columns) {
            if (data[col] != undefined) {
                sql += " ," + col + "=? ";
                param.push(data[col]);
            }
        }
        sql += " where id=? ";
        param.push(data.id);

        return { sql: sql, param: param };
    }

    public preInsertSql(data) {
        var param = [];

        var sql = "insert into " + this.tableName() + " (updated_date";
        var columns = this.tableColumns();
        for (let col in columns) {
            if (data[col] != undefined) {
                sql += " ," + col + " ";
            }
        }
        sql += " ,id) values (datetime('now', 'localtime') ";
        for (let col in columns) {
            if (data[col] != undefined) {
                sql += " ,? ";
                param.push(data[col]);
            }
        }
        sql += " ,?);"
        param.push(data.id);

        return { sql: sql, param: param };
    }

    public simpleQuery(condition) {
        var sql = "select * from " + this.tableName() + " where 1=1 ";
        var searchdata = new Array();
        for (let i in condition) {
            var columns = this.tableColumns();
            var coltype = columns[i];
            if (coltype == "varchar") {
                sql += " and " + i + " like ?";
                searchdata.push(condition[i]);
            } else if (coltype == "int") {
                sql += " and " + i + " = ?";
                searchdata.push(condition[i]);
            }
        }
        if (condition["orderby"] != null && condition["orderby"] != "") {
            sql += " order by " + condition["orderby"];
        }
        if (condition["limit"] != null && condition["limit"] != "") {
            sql += " limit " + condition["limit"];
        }
        return this.getDbInstance().then((db: SQLiteObject) => {
            return db.executeSql(sql, searchdata).then(data => {
                var ret = new Array();
                for (var i = 0; i < data.rows.length; i++) {
                    ret.push(data.rows.item(i));
                }
                return ret;
            });
        });
    }

    public getOne(id) {
        var sql = "select * from " + this.tableName() + " where id=? ";
        return this.getDbInstance().then((db: SQLiteObject) => {
            return db.executeSql(sql, [id]).then(data => {
                if (data.rows.length > 0) {
                    return data.rows.item(0);
                } else {
                    return null;
                }
            });
        });
    }

}