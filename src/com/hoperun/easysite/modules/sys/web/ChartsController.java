/**
dashboard1.jsp * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.modules.sys.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hoperun.easysite.common.web.BaseController;

/**
 * 用户Controller
 *
 * @author ql
 * @version 2013-8-29
 */
@Controller
@RequestMapping(value = "${adminPath}/sys/charts")
public class ChartsController extends BaseController {

   
    @RequestMapping(value = {"chart1"})
    public String dashboard1( Model model) {
        return "modules/sys/index/charts/chart1";
    }

    @RequestMapping(value = {"chart2"})
    public String dashboard2( Model model) {
        return "modules/sys/index/charts/chart2";
    }

    @RequestMapping(value = {"chart3"})
    public String dashboard3( Model model) {
        return "modules/sys/index/charts/chart3";
    }

    @RequestMapping(value = {"chart4"})
    public String dashboard4( Model model) {
        return "modules/sys/index/charts/chart5";
    }

    @RequestMapping(value = {"chart5"})
    public String dashboard5( Model model) {
        return "modules/sys/index/charts/chart5";
    }

    
    
}
