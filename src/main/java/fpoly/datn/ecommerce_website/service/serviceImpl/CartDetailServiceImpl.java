package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.BillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.CartDetailDTO;
import fpoly.datn.ecommerce_website.entity.BillDetails;
import fpoly.datn.ecommerce_website.entity.CartDetails;
import fpoly.datn.ecommerce_website.entity.Carts;
import fpoly.datn.ecommerce_website.repository.ICartDetailRepository;
import fpoly.datn.ecommerce_website.repository.ICartRepository;
import fpoly.datn.ecommerce_website.service.CartDetailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartDetailServiceImpl implements CartDetailService {

    @Autowired
    private ICartDetailRepository iCartDetailRepository;

    @Autowired
    private ICartRepository iCartRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CartDetails> getAll() {
        List<CartDetails> list = iCartDetailRepository.findAll();
        return list;
    }


    @Override
    public CartDetailDTO addToCart(CartDetailDTO cartDetailDTO) {
        CartDetails cartDetails = modelMapper.map(cartDetailDTO, CartDetails.class);
        CartDetails savedCartDetails = iCartDetailRepository.save(cartDetails);
        return modelMapper.map(savedCartDetails, CartDetailDTO.class);
    }

    @Override
    public CartDetails updateAmountToCart(String id, int amount) {
        CartDetails cartDetails = iCartDetailRepository.findById(id).get();
        cartDetails.setAmount(amount);
        CartDetails details = iCartDetailRepository.save(cartDetails);
        return details;


    }

    @Override
    public Boolean delete(String id) {
        Optional<CartDetails> optional = iCartDetailRepository.findById(id);
        if (optional.isPresent()) {
            CartDetails cartDt = optional.get();
            iCartDetailRepository.delete(cartDt);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Boolean deleteAllCartDetail(String cartId) {
        List<CartDetails> cartDetailsList = iCartDetailRepository.findByCartId(cartId);
        if (!cartDetailsList.isEmpty()) {
            iCartDetailRepository.deleteAll(cartDetailsList);
            return true;
        } else {
            return false;
        }
    }

}
