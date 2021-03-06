/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.sys.dao;

import com.hoperun.easysite.common.persistence.TreeDao;
import com.hoperun.easysite.common.persistence.annotation.MyBatisDao;
import com.hoperun.easysite.modules.sys.entity.Area;

/**
 * 区域DAO接口
 * @author ql
 * @version 2014-05-16
 */
@MyBatisDao
public interface AreaDao extends TreeDao<Area> {
	
}
