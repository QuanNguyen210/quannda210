package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.CartDTO;
import fpoly.datn.ecommerce_website.entity.CartDetails;
import fpoly.datn.ecommerce_website.repository.ICartDetailRepository;
import fpoly.datn.ecommerce_website.service.CartService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api")
@RestController
public class CartDetailRestController {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ICartDetailRepository iCartDetailRepository;

    //GetAll
    @RequestMapping(value = "/cart-details/", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(this.iCartDetailRepository.findAll());
    }

    @RequestMapping(value = "/cart-details/", method = RequestMethod.POST)
    public ResponseEntity<?> add(@RequestBody CartDetails cartDetails) {
        return ResponseEntity.ok(this.iCartDetailRepository.save(cartDetails));
    }


}
