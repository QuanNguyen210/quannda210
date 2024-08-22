package fpoly.datn.ecommerce_website.restController.auth;


import fpoly.datn.ecommerce_website.entity.base.ResponseObject;
import fpoly.datn.ecommerce_website.model.request.CreateUserRequest;
import fpoly.datn.ecommerce_website.model.request.FindUserRequest;
import fpoly.datn.ecommerce_website.model.request.UpdateUserRequest;
import fpoly.datn.ecommerce_website.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/mentor/user")
@CrossOrigin("*")
public class MentorController {

    @Autowired
    private IUserService userService;

    @GetMapping
    public ResponseObject getAllUser(final FindUserRequest request) {
        return new ResponseObject(userService.findUser(request));
    }
}
