/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.offlinedev.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.hoperun.easysite.common.config.Global;
import com.hoperun.easysite.common.persistence.Page;
import com.hoperun.easysite.common.web.BaseController;
import com.hoperun.easysite.common.utils.StringUtils;
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTable;
import com.hoperun.easysite.modules.offlinedev.service.OfflineTableService;

/**
 * 自定义建表Controller
 * @author hf
 * @version 2017-06-21
 */
@Controller
@RequestMapping(value = "${adminPath}/offlinedev/offlineTable")
public class OfflineTableController extends BaseController {

	@Autowired
	private OfflineTableService offlineTableService;
	
	@ModelAttribute
	public OfflineTable get(@RequestParam(required=false) String id) {
		OfflineTable entity = null;
		if (StringUtils.isNotBlank(id)){
			entity = offlineTableService.get(id);
		}
		if (entity == null){
			entity = new OfflineTable();
		}
		return entity;
	}
	
	@RequiresPermissions("offlinedev:offlineTable:view")
	@RequestMapping(value = {"list", ""})
	public String list(OfflineTable offlineTable, HttpServletRequest request, HttpServletResponse response, Model model) {
		Page<OfflineTable> page = offlineTableService.findPage(new Page<OfflineTable>(request, response), offlineTable); 
		model.addAttribute("page", page);
		return "modules/offlinedev/offlineTableList";
	}

	@RequiresPermissions("offlinedev:offlineTable:view")
	@RequestMapping(value = "form")
	public String form(OfflineTable offlineTable, Model model) {
		model.addAttribute("offlineTable", offlineTable);
		return "modules/offlinedev/offlineTableForm";
	}

	@RequiresPermissions("offlinedev:offlineTable:edit")
	@RequestMapping(value = "save")
	public String save(OfflineTable offlineTable, Model model, RedirectAttributes redirectAttributes) {
		if (!beanValidator(model, offlineTable)){
			return form(offlineTable, model);
		}
		offlineTableService.save(offlineTable);
		addMessage(redirectAttributes, "保存自定义建表成功");
		return "redirect:"+Global.getAdminPath()+"/offlinedev/offlineTable/?repage";
	}
	
	@RequiresPermissions("offlinedev:offlineTable:edit")
	@RequestMapping(value = "delete")
	public String delete(OfflineTable offlineTable, RedirectAttributes redirectAttributes) {
		offlineTableService.delete(offlineTable);
		addMessage(redirectAttributes, "删除自定义建表成功");
		return "redirect:"+Global.getAdminPath()+"/offlinedev/offlineTable/?repage";
	}
	/**
	 * 同步数据库
	 * @param offlineTable
	 * @param model
	 * @param redirectAttributes
	 * @return
	 */
	@RequiresPermissions("offlinedev:offlineTable:edit")
	@RequestMapping(value = "synDb")
	public String synDb(OfflineTable offlineTable, Model model, RedirectAttributes redirectAttributes) {
		String tableName = offlineTable.getTableName();
		String message = "同步数据库成功";
//		message = offlineTableService.checkTableName(tableName);
//		if(message == null || message.length() <= 0){
		try{
			offlineTableService.synDb(tableName);
		}catch(Exception e){
			message = "同步数据库失败";
			e.printStackTrace();
		}
			
		// }else{
		// message = "该表已经存在！";
		// }
		addMessage(redirectAttributes, message);
		return "redirect:"+Global.getAdminPath()+"/offlinedev/offlineTable/?repage";
	}
	
}