package fpoly.datn.ecommerce_website.service;


import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.entity.base.PageableObject;
import fpoly.datn.ecommerce_website.model.request.CreateUserRequest;
import fpoly.datn.ecommerce_website.model.request.FindUserRequest;
import fpoly.datn.ecommerce_website.model.request.UpdateUserRequest;
import fpoly.datn.ecommerce_website.model.response.UserResponse;
import jakarta.validation.Valid;

import java.util.UUID;

public interface UserService {



    Users findUserById(UUID id);

    Users create(CreateUserRequest request);

    Users update(@Valid UpdateUserRequest request);

    UUID delete(UUID id);

    Users findUserByEmail(String email);

}
