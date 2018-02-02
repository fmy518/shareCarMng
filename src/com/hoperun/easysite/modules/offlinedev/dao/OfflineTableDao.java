/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.dao;

import java.util.Map;

import com.hoperun.easysite.common.persistence.CrudDao;
import com.hoperun.easysite.common.persistence.annotation.MyBatisDao;
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTable;

/**
 * 自定义建表DAO接口
 * @author hf
 * @version 2017-06-21
 */
@MyBatisDao
public interface OfflineTableDao extends CrudDao<OfflineTable> {
	
	/**
	 * 删除表
	 * @param createTable
	 * @return
	 */
	public int dropTable(Map<String,Object> dropTable);

	/**
	 * 创建表
	 * @param createTable
	 * @return
	 */
	public int createTable(Map<String,Object> createTable);

	/**
	 * 校验表是否存在
	 * @param tableName
	 * @return
	 */
	public String checkTableName(String tableName);
	
	/**
	 * 更新同步状态
	 * @param tableName
	 * @return
	 */
	public int updateState(String tableName);

	
}