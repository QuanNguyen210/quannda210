package fpoly.datn.ecommerce_website;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testController {
 @GetMapping("/test/abc")
 public String test (){
     return "abc";
 }
}
