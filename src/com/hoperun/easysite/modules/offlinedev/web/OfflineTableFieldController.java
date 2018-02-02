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
import com.hoperun.easysite.modules.offlinedev.entity.OfflineTableField;
import com.hoperun.easysite.modules.offlinedev.service.OfflineTableFieldService;

/**
 * 建表属性Controller
 * @author hf
 * @version 2017-06-22
 */
@Controller
@RequestMapping(value = "${adminPath}/offlinedev/offlineTableField")
public class OfflineTableFieldController extends BaseController {

	@Autowired
	private OfflineTableFieldService offlineTableFieldService;
	
	@ModelAttribute
	public OfflineTableField get(@RequestParam(required=false) String id) {
		OfflineTableField entity = null;
		if (StringUtils.isNotBlank(id)){
			entity = offlineTableFieldService.get(id);
		}
		if (entity == null){
			entity = new OfflineTableField();
		}
		return entity;
	}
	
	@RequestMapping(value = {"list", ""})
	public String list(OfflineTableField offlineTableField, HttpServletRequest request, HttpServletResponse response, Model model) {
		Page<OfflineTableField> page = offlineTableFieldService.findPage(new Page<OfflineTableField>(request, response), offlineTableField); 
		model.addAttribute("page", page);
		return "modules/offlinedev/offlineTableFieldList";
	}

	@RequestMapping(value = "form")
	public String form(OfflineTableField offlineTableField, Model model) {
		model.addAttribute("offlineTableField", offlineTableField);
		return "modules/offlinedev/offlineTableFieldForm";
	}

	@RequestMapping(value = "save")
	public String save(OfflineTableField offlineTableField, Model model, RedirectAttributes redirectAttributes) {
		if (!beanValidator(model, offlineTableField)){
			return form(offlineTableField, model);
		}
		offlineTableFieldService.save(offlineTableField);
		addMessage(redirectAttributes, "保存建表属性成功");
		return "redirect:"+Global.getAdminPath()+"/offlinedev/offlineTableField/?repage";
	}
	
	@RequestMapping(value = "delete")
	public String delete(OfflineTableField offlineTableField, RedirectAttributes redirectAttributes) {
		offlineTableFieldService.delete(offlineTableField);
		addMessage(redirectAttributes, "删除建表属性成功");
		return "redirect:"+Global.getAdminPath()+"/offlinedev/offlineTableField/?repage";
	}

}