package fpoly.datn.ecommerce_website.restController.auth;


import fpoly.datn.ecommerce_website.entity.base.ResponseObject;
import fpoly.datn.ecommerce_website.service.IUserService;
import fpoly.datn.ecommerce_website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/intern/user")
@CrossOrigin("*")
public class InternController {

    @Autowired
    private IUserService userService;

    @GetMapping("/{id}")
    public ResponseObject getProfile(@PathVariable("id") UUID id) {
        return new ResponseObject(userService.findById(String.valueOf(id)));
    }
}
