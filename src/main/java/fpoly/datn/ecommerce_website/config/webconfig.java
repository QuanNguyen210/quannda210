package fpoly.datn.ecommerce_website.config;

import fpoly.datn.ecommerce_website.dto.Product_ProductDetailDTO;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class webconfig {
    @Bean
    public WebMvcConfigurer webMvcConfigurer (){
        return  new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT","DELETE");
            }
        };
    }
}
