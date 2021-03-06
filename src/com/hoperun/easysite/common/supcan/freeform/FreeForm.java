/**
 * Copyright &copy; 2012-2016 <a href="http://www.qiliangkeji.com">easysite</a> All rights reserved.
 */
package com.hoperun.easysite.common.supcan.freeform;

import com.hoperun.easysite.common.supcan.common.Common;
import com.hoperun.easysite.common.supcan.common.properties.Properties;
import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * 硕正FreeForm
 * @author ql
 * @version 2013-11-04
 */
@XStreamAlias("FreeForm")
public class FreeForm extends Common {

	public FreeForm() {
		super();
	}
	
	public FreeForm(Properties properties) {
		this();
		this.properties = properties;
	}
	
}
