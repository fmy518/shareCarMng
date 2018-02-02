package com.hoperun.easysite.common.utils;

/**
 * 检查类
 *
 * @author wukong(wukonggg@139.com)
 */
public class Asserts {

    /**
     * 检查待匹配内容中至少有一个与期望匹配字符串一致，否则抛出IllegalArgumentException。
     *
     * @param message 提示消息。可以为null
     * @param source 待匹配内容
     * @param expect 期望匹配的内容
     */
    public static void equalsAtLestOne(String message, String source, String... expect) {
        if (null == source && null == expect) {
            return;
        } else if (null == source || null == expect || expect.length == 0) {
            throw new IllegalArgumentException("传入参数不能为null");
        }

        boolean ok = false;
        for (String s : expect) {
            if (source.equals(s)) {
                ok = true;
                break;
            }
        }
        if (!ok) {
            if (null == message || "".equals(message)) {
                throw new IllegalArgumentException();
            } else {
                throw new IllegalArgumentException(message);
            }

        }
    }

}
