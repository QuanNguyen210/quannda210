package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.BillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.CartDTO;
import fpoly.datn.ecommerce_website.entity.Carts;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.repository.ICartRepository;
import fpoly.datn.ecommerce_website.service.CartService;
import fpoly.datn.ecommerce_website.service.serviceImpl.CartServiceImpl;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api")
@RestController
public class CartRestController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ICartRepository iCartRepository;

    ///GetOne
    @RequestMapping(value = "/cart/{customerId}", method = RequestMethod.GET)
    public ResponseEntity<?> getOneCart(@PathVariable String customerId) {
        if (cartService.findById(customerId) != null) {
            return ResponseEntity.ok(cartService.findById(customerId));

        } else {
            return ResponseEntity.ok("Không tìm thấy ID !!!");
        }
    }

    @GetMapping("/carts/{customerId}")
    public ResponseEntity<?> getOneCustomer(@PathVariable String customerId) {
        if (cartService.findAll(customerId) != null) {
            return ResponseEntity.ok(cartService.findAll(customerId));

        } else {
            return ResponseEntity.ok("Không tìm thấy ID !!!");
        }
    }



    //PhanTrang
    @RequestMapping(value = "/cart/pagination", method = RequestMethod.GET)
    public ResponseEntity<?> phanTrang(@RequestParam(defaultValue = "0", name = "page") Integer page) {
        return ResponseEntity.ok(cartService.findAllPhanTrang(page));
    }


    //
    //Add
    @RequestMapping(value = "/cart", method = RequestMethod.POST)
    public ResponseEntity<?> add(@RequestBody CartDTO cartDTO) {
        return new ResponseEntity<>(this.cartService.save(cartDTO), HttpStatus.OK);
    }

    //update
    @RequestMapping(value = "/cart", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@RequestBody @Valid CartDTO cartDTO, @RequestParam String id) {
        if (cartService.findById(id) != null) {
            return ResponseEntity.ok(cartService.update(cartDTO, id));

        } else {
            return ResponseEntity.ok("ID cần update không tồn tại, vui lòng kiểm tra lại ID !!");
        }

    }

    //delete
    @RequestMapping(value = "/cart", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@RequestParam String id) {
        if (cartService.delete(id)) {
            return ResponseEntity.ok("Xóa thành công!!");
        } else {
            return ResponseEntity.ok("id không tồn tại để xóa!!");
        }
    }


}
