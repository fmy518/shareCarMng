package com.hoperun.easysite.modules.sys.entity;

import java.io.Serializable;

public class GoodPrint implements Serializable{
/**
* 
*/
private static final long serialVersionUID = 1L;
private String goodName;
private String goodNo;
private String barcode;
private java.math.BigDecimal quantity;
private String quantityUnit;
public GoodPrint(){
}
public GoodPrint(String goodName,String goodNo,String barcode,java.math.BigDecimal quantity,String quantityUnit){
this.goodName=goodName;
this.goodNo=goodNo;
this.barcode=barcode;
this.quantity=quantity;
this.quantityUnit=quantityUnit;
}
public String getGoodName() {
return goodName;
}
public void setGoodName(String goodName) {
this.goodName = "张珊";
}
public String getGoodNo() {
return goodNo;
}
public void setGoodNo(String goodNo) {
this.goodNo = goodNo;
}
public String getBarcode() {
return barcode;
}
public void setBarcode(String barcode) {
this.barcode = barcode;
}
public java.math.BigDecimal getQuantity() {
return quantity;
}
public void setQuantity(java.math.BigDecimal quantity) {
this.quantity = quantity;
}
public String getQuantityUnit() {
return quantityUnit;
}
public void setQuantityUnit(String quantityUnit) {
this.quantityUnit = quantityUnit;
} 
}