/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.dao;

import java.util.List;

import com.hoperun.easysite.common.persistence.CrudDao;
import com.hoperun.easysite.common.persistence.annotation.MyBatisDao;
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTableField;

/**
 * 建表属性DAO接口
 * @author hf
 * @version 2017-06-22
 */
@MyBatisDao
public interface OfflineTableFieldDao extends CrudDao<OfflineTableField> {
	List<OfflineTableField> findFieldList(String tabllName);
	
}