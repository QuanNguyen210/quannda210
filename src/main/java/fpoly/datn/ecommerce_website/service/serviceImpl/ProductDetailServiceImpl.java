package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.dto.ProductDetailDTO;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import fpoly.datn.ecommerce_website.infrastructure.constant.Message;
import fpoly.datn.ecommerce_website.infrastructure.exception.rest.RestApiException;
import fpoly.datn.ecommerce_website.repository.IProductDetailRepository;
import fpoly.datn.ecommerce_website.service.IProductDetalisService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductDetailServiceImpl implements IProductDetalisService {

    @Autowired
    private IProductDetailRepository iProductDetailRepository;

    @Autowired
    private ModelMapper modelMapper;
    private List<Sort.Order> createSortOrder(List<String> sortList, String sortDirection) {
        List<Sort.Order> sorts = new ArrayList<>();
        Sort.Direction direction;
        for (String sort : sortList) {
            if (sortDirection != null) {
                direction = Sort.Direction.fromString(sortDirection);
            } else {
                direction = Sort.Direction.DESC;
            }
            sorts.add(new Sort.Order(direction, sort));
        }
        return sorts;
    }

    @Override
    public List<ProductDetailDTO> findAll() {
        return this.iProductDetailRepository.findAll().stream()
                .map(productDetails -> modelMapper.map(productDetails, ProductDetailDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public Page<ProductDetailDTO> findAllPagination(
            int pageNum,
            int pageSize,
            String productName,
            String productCode,
            String colorName,
            String typeName,
            String materialName,
            String sizeName,
            String brandName,
            String compartmentName,
            String producerName,
            String buckleTypeName,
            String productDetailDescribe,
            Integer  minProductDetailAmount,
            Integer  maxProductDetailAmount,
            Integer  minImportPrice,
            Integer  maxImportPrice,
            Integer  minRetailPrice,
            Integer  maxRetailPrice,
            Integer  productDetailStatus,
            List<String> sortList,
            String sortOrder
    ) {
        PageRequest pageRequest = PageRequest.of(pageNum, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        Page<ProductDetails> productPage = this.iProductDetailRepository
                .getProductDetailsWithoutDelete(
                         productName,
                         productCode,
                         colorName,
                         typeName,
                         materialName,
                         sizeName,
                         brandName,
                         compartmentName,
                         producerName,
                         buckleTypeName,
                         productDetailDescribe,
                        minProductDetailAmount,
                        maxProductDetailAmount,
                        minImportPrice,
                        maxImportPrice,
                        minRetailPrice,
                        maxRetailPrice,
                        productDetailStatus,
                        pageRequest);

        List<ProductDetailDTO> productDTOList = productPage.getContent()
                .stream().map(product -> modelMapper.map(product, ProductDetailDTO.class))
                .collect(Collectors.toList());
        return new PageImpl<>(productDTOList, pageRequest, productPage.getTotalElements());
    }

    @Override
    public List<ProductDetails> findAllByProductCode(String productCode) {
        return this.iProductDetailRepository.findAllByProductCode(productCode);
    }
    @Override
    public ProductDetailDTO updateStatus(String productDetailsID, int status) {
        Optional<ProductDetails> productDetails = iProductDetailRepository.findById(productDetailsID);
        System.out.println("productDetails");
        System.out.println(productDetails);
        productDetails.get().setProductDetailStatus(status);

        return modelMapper.map(this.iProductDetailRepository.save(productDetails.get()), ProductDetailDTO.class);
    }

    public List<ProductDetails> findAllByProductId(String productId) {
        return this.iProductDetailRepository.findAllByProductId(productId);
    }
    @Override
    public ProductDetails findById(String id) {
        try {
            Optional<ProductDetails> optional = iProductDetailRepository.findById(id);
            return optional.orElse(null);
        } catch (Exception ex) {
            throw new RestApiException(Message.ERROR_UNKNOWN);

        }
    }


    @Override
    public ProductDetailDTO save(ProductDetailDTO entity) {
        ProductDetails productDetails = iProductDetailRepository.save(modelMapper.map(entity, ProductDetails.class));
        return modelMapper.map(productDetails, ProductDetailDTO.class);
    }


    @Override
    public ProductDetails update(ProductDetails entity) {
        return iProductDetailRepository.save(entity);
    }


    @Override
    public String delete(String id) {
        iProductDetailRepository.deleteById(id);
        return "Delete successfully";
    }


    @Override
    public List<ProductDetails> searchByName(String name) {
        return null;
    }

    @Override
    public List<ProductDetails> findByKeyword(String keyword) {

        return this.iProductDetailRepository.findByKeyword(keyword);
    }
}
