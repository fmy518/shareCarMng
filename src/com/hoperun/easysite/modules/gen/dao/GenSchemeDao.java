/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.gen.dao;

import com.hoperun.easysite.common.persistence.CrudDao;
import com.hoperun.easysite.common.persistence.annotation.MyBatisDao;
import com.hoperun.easysite.modules.gen.entity.GenScheme;

/**
 * 生成方案DAO接口
 * @author ql
 * @version 2013-10-15
 */
@MyBatisDao
public interface GenSchemeDao extends CrudDao<GenScheme> {
	
}
