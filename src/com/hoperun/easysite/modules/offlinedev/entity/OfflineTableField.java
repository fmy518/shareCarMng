/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.entity;

import org.hibernate.validator.constraints.Length;

import com.hoperun.easysite.common.persistence.DataEntity;

/**
 * 建表属性Entity
 * @author hf
 * @version 2017-06-22
 */
public class OfflineTableField extends DataEntity<OfflineTableField> {
	
	private static final long serialVersionUID = 1L;
	private String fieldName;		// 字段名称
	private String tableName;		// 所属表
	private String fieldComment;		// 字段备注
	private String type;		// 数据库字段类型
	private String length;		// 数据库字段长度
	private String isKey;		// 是否主键
	private String isNull;		// 是否允许为空
	private String orderNum;		// order_num
	private String mainField;		// 外键主键字段
	private String mainTable;		// 外键主表名
	private String notes;		// 备注
	
	public OfflineTableField() {
		super();
	}

	public OfflineTableField(String id){
		super(id);
	}

	@Length(min=1, max=200, message="字段名称长度必须介于 1 和 200 之间")
	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}
	
	@Length(min=1, max=32, message="所属表长度必须介于 1 和 32 之间")
	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
	@Length(min=0, max=255, message="字段备注长度必须介于 0 和 255 之间")
	public String getFieldComment() {
		return fieldComment;
	}

	public void setFieldComment(String fieldComment) {
		this.fieldComment = fieldComment;
	}
	
	@Length(min=0, max=32, message="数据库字段类型长度必须介于 0 和 32 之间")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	@Length(min=0, max=11, message="数据库字段长度长度必须介于 0 和 11 之间")
	public String getLength() {
		return length;
	}

	public void setLength(String length) {
		this.length = length;
	}
	
	@Length(min=0, max=2, message="是否主键长度必须介于 0 和 2 之间")
	public String getIsKey() {
		return isKey;
	}

	public void setIsKey(String isKey) {
		this.isKey = isKey;
	}
	
	@Length(min=0, max=5, message="是否允许为空长度必须介于 0 和 5 之间")
	public String getIsNull() {
		return isNull;
	}

	public void setIsNull(String isNull) {
		this.isNull = isNull;
	}
	
	@Length(min=0, max=4, message="order_num长度必须介于 0 和 4 之间")
	public String getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(String orderNum) {
		this.orderNum = orderNum;
	}
	
	@Length(min=0, max=100, message="外键主键字段长度必须介于 0 和 100 之间")
	public String getMainField() {
		return mainField;
	}

	public void setMainField(String mainField) {
		this.mainField = mainField;
	}
	
	@Length(min=0, max=100, message="外键主表名长度必须介于 0 和 100 之间")
	public String getMainTable() {
		return mainTable;
	}

	public void setMainTable(String mainTable) {
		this.mainTable = mainTable;
	}
	
	@Length(min=0, max=500, message="备注长度必须介于 0 和 500 之间")
	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
	
}