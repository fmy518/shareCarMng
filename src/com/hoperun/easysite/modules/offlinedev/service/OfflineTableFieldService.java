/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoperun.easysite.common.persistence.Page;
import com.hoperun.easysite.common.service.CrudService;
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTableField;
import com.hoperun.easysite.modules.offlinedev.dao.OfflineTableFieldDao;

/**
 * 建表属性Service
 * @author hf
 * @version 2017-06-22
 */
@Service
@Transactional(readOnly = true)
public class OfflineTableFieldService extends CrudService<OfflineTableFieldDao, OfflineTableField> {

	public OfflineTableField get(String id) {
		return super.get(id);
	}
	
	public List<OfflineTableField> findList(OfflineTableField offlineTableField) {
		return super.findList(offlineTableField);
	}
	
	public Page<OfflineTableField> findPage(Page<OfflineTableField> page, OfflineTableField offlineTableField) {
		return super.findPage(page, offlineTableField);
	}
	
	@Transactional(readOnly = false)
	public void save(OfflineTableField offlineTableField) {
		super.save(offlineTableField);
	}
	
	@Transactional(readOnly = false)
	public void delete(OfflineTableField offlineTableField) {
		super.delete(offlineTableField);
	}
	
}