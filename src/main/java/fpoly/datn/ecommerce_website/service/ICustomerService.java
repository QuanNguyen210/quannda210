package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.dto.CustomerDTO;
import fpoly.datn.ecommerce_website.dto.CustomerDTO1;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICustomerService {

    Page<Customers> findAllCustomersWithUserInfoUserRole(Integer page, Integer size);

    Page<Customers> findAllSearch(String search, Integer status, Boolean gender, Ranking ranking, Integer page, Integer size, List<String> sortList, String sortOrder);

    List<Customers> findAll();

    Customers findById(String id);

    Customers save(CustomerDTO customerDTO);

    Customers update( CustomerDTO customerDTO);

     Customers updateNotPassword(CustomerDTO customerDTO) ;

     Customers updateStatus(String id, Integer status);

    String delete(String id);

    List<CustomerDTO> findByKeyword(String keyword);

    List<CustomerDTO> findCustomerByKeyword(String keyword);

    Customers findByEmail(String mail);


    Customers updateConsumePoint(String customerId, int updateConsumePoint);

    CustomerDTO updatePointByTotalPrice(String customerId, Double totalPrice);

    boolean changePassword(String id, String oldPassword, String newPassword);
}
