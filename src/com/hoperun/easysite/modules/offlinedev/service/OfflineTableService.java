/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoperun.easysite.common.persistence.Page;
import com.hoperun.easysite.common.service.CrudService;
import com.hoperun.easysite.modules.offlinedev.dao.OfflineTableDao;
import com.hoperun.easysite.modules.offlinedev.dao.OfflineTableFieldDao;
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTable;
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTableField;

/**
 * 自定义建表Service
 * 
 * @author hf
 * @version 2017-06-21
 */
@Service
@Transactional(readOnly = true)
public class OfflineTableService extends
		CrudService<OfflineTableDao, OfflineTable> {

	@Autowired
	private OfflineTableDao offlineTableDao;

	@Autowired
	private OfflineTableFieldDao offlineTableFieldDao;

	public OfflineTable get(String id) {
		return super.get(id);
	}

	public List<OfflineTable> findList(OfflineTable offlineTable) {
		return super.findList(offlineTable);
	}

	public Page<OfflineTable> findPage(Page<OfflineTable> page,
			OfflineTable offlineTable) {
		return super.findPage(page, offlineTable);
	}

	@Transactional(readOnly = false)
	public void save(OfflineTable offlineTable) {
		super.save(offlineTable);
	}

	@Transactional(readOnly = false)
	public void delete(OfflineTable offlineTable) {
		super.delete(offlineTable);
	}

	/**
	 * 根据
	 * 
	 * @param tableName
	 * @return
	 */
	public List<OfflineTableField> findFieldList(String tableName) {
		return offlineTableFieldDao.findFieldList(tableName);
	}

	/**
	 * 同步数据库
	 * 
	 * @param tableName
	 */
	@Transactional(readOnly = false)
	public void synDb(String tableName) {
		StringBuffer createTableSql = new StringBuffer();
		StringBuffer dropTableSql = new StringBuffer();
		dropTableSql.append("DROP TABLE IF EXISTS ").append(tableName);
		createTableSql.append("CREATE TABLE ").append(tableName).append(" (");
		List<OfflineTableField> fieldList = findFieldList(tableName);
		if (fieldList != null && fieldList.size() > 0) {
			for (int i = 0; i < fieldList.size(); i++) {
				OfflineTableField field = fieldList.get(i);
				createTableSql
						.append(field.getFieldName())
						.append(" ")
						.append(field.getType())
						.append(" (")
						.append(field.getLength())
						.append(") ")
						.append(field.getIsNull().equals("1") ? " DEFAULT NULL "
								: " NOT NULL ").append("COMMENT '")
						.append(field.getFieldComment()).append("',");
				if (field.getIsKey().equals("1")) {
					createTableSql.append(" PRIMARY KEY ("
							+ field.getFieldName() + "),");
				}
			}
			// 去掉最后的逗号
			String createSql = createTableSql.toString().substring(0,
					createTableSql.length() - 1);
			createSql = createSql + ") ENGINE=InnoDB DEFAULT CHARSET=utf8";
			System.out.println("createSql:" + createSql);
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("createSql", createSql);
			map.put("dropSql", dropTableSql.toString());
			// 删除表
			offlineTableDao.dropTable(map);
			// 创建表
			offlineTableDao.createTable(map);
			//更新offline_table同步状态
			offlineTableDao.updateState(tableName);
		}

	}

	/**
	 * 校验表名称
	 * 
	 * @param tableName
	 */
	@Transactional(readOnly = false)
	public String checkTableName(String tableName) {
		// 先校验表是否已经存在
		return offlineTableDao.checkTableName(tableName);
	}
	
	
}