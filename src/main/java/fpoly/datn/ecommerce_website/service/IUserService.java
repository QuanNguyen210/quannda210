package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.entity.base.PageableObject;
import fpoly.datn.ecommerce_website.model.request.CreateUserRequest;
import fpoly.datn.ecommerce_website.model.request.FindUserRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IUserService {
    public Users create(@Valid CreateUserRequest request);
    List<Users> findAll();

    Page<Users> findAllPhanTrang(Integer page, Integer size);

    Users findById(String id);

    Users findByEmail(String email);

    Users save(Users users);

    Users update(Users customer);

    Users updateStatus(String id, int status);

    String delete(String id);


    List<Users> searchByName(String name);

    List<Users> findCustomerByKeyword(String keyword);

    PageableObject<Users> findUser(FindUserRequest request);
}
