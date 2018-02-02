/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.entity;

import org.hibernate.validator.constraints.Length;

import com.hoperun.easysite.common.persistence.DataEntity;

/**
 * 自定义建表Entity
 * @author hf
 * @version 2017-06-21
 */
public class OfflineTable extends DataEntity<OfflineTable> {
	
	private static final long serialVersionUID = 1L;
	private String tableName;		// table_name
	private String tableType;		// table_type
	private String tableComment;		// table_comment
	private String isSynDb;		// is_syn_db
	private String notes;		// notes
	
	public OfflineTable() {
		super();
	}

	public OfflineTable(String id){
		super(id);
	}

	@Length(min=0, max=255, message="table_name长度必须介于 0 和 255 之间")
	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
	@Length(min=0, max=255, message="table_type长度必须介于 0 和 255 之间")
	public String getTableType() {
		return tableType;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}
	
	@Length(min=0, max=255, message="table_comment长度必须介于 0 和 255 之间")
	public String getTableComment() {
		return tableComment;
	}

	public void setTableComment(String tableComment) {
		this.tableComment = tableComment;
	}
	
	@Length(min=0, max=255, message="is_syn_db长度必须介于 0 和 255 之间")
	public String getIsSynDb() {
		return isSynDb;
	}

	public void setIsSynDb(String isSynDb) {
		this.isSynDb = isSynDb;
	}
	
	@Length(min=0, max=255, message="notes长度必须介于 0 和 255 之间")
	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
	
}