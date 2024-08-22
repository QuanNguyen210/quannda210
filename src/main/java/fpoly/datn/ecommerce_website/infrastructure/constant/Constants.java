package fpoly.datn.ecommerce_website.infrastructure.constant;

public final class Constants {

    private Constants() {
    }

    public static final String ENCODING_UTF8 = "UTF-8";

    public class FileProperties {
        private FileProperties() {
        }

        public static final String PROPERTIES_APPLICATION = "application.properties";
        public static final String PROPERTIES_VALIDATION = "messages.properties";
    }

    public static final String REGEX_EMAIL_FE = "\\w+@fe.edu.vn";

    public static final String REGEX_EMAIL_FPT = "\\w+@fpt.edu.vn";

    public static final String REGEX_PHONE_NUMBER = "(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}";

    public static final String REGEX_DATE = "^(0[1-9]|1[012])/(0[1-9]|[12][0-9]|[3][01])/\\\\d{4}$";

    public static final String JWTSECRET = "QHMBQfsViR66wU3Yx/MOdkKcHdmJeRy4JdbDbrjmZdfu35Q7yzH6b3vJCrQcNgoOEFfsGyhOeF5Pby7R+YzG0w==";

    public static final int JWTEXPIRATIONINMS = 604800; // 86400 is 1 day => 86400 * 7 = 604,800 (7 weeks)
    public static final Integer PERCENT_TO_RECEIVE = 10/100; //
    public static final Double PRICE_TO_ADD_1POINT = 5000.0; //
    public static final Double TOTALPRICE_TO_ADD_1POINT = 500000.0; //
    public static final Double TOTALPRICE_TO_ADD_10POINT = 1000000.0; //
    public static final Double TOTALPRICE_TO_ADD_20POINT = 1500000.0; //
    public static final Integer POINTS_TO_UP_KHTN = 100; //
    public static final Integer POINTS_TO_UP_KHTT = 500; //
    public static final Integer POINTS_TO_UP_KHB = 1000; //
    public static final Integer POINTS_TO_UP_KHV = 1500; //
    public static final Integer POINTS_TO_UP_KHKC = 2000; //
}
