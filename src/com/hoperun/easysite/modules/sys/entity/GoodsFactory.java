package com.hoperun.easysite.modules.sys.entity;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;

public class GoodsFactory {
private static GoodPrint[] data={new GoodPrint("GOO1","A","GOO1A",new BigDecimal(10),"M"),
new GoodPrint("GOO2","B","GOO2B",new BigDecimal(20),"PCS")}; 
public static Object[] getBeanArray() {
     return data;
}
public static Collection<?> getBeanCollection() {
        return Arrays.asList(data);
    }
}