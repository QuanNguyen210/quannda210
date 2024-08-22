package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.ProductDTO;
import fpoly.datn.ecommerce_website.dto.ProductDetailDTO;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import fpoly.datn.ecommerce_website.infrastructure.constant.Message;
import fpoly.datn.ecommerce_website.infrastructure.exception.rest.RestApiException;
import fpoly.datn.ecommerce_website.service.serviceImpl.ProductDetailServiceImpl;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProductDetailRestController {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductDetailServiceImpl productDetailService;

    //getOne
    @RequestMapping(value = "/product-details/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getOne(@PathVariable String id) {
        ProductDetails productDetails = this.productDetailService.findById(id);
        if (productDetails == null) {
            return new ResponseEntity<>(
                    null
                    , HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(
                modelMapper.map(productDetails, ProductDetailDTO.class)
                , HttpStatus.OK);
    }


    @RequestMapping(value = "/product-details", method = RequestMethod.GET)
    public ResponseEntity<?> getAll(
            @RequestParam(name = "page", required = false) Integer pageNum,
            @RequestParam(name = "size", required = false) Integer pageSize,
            @RequestParam(name = "productName", required = false, defaultValue = "") String productName,
            @RequestParam(name = "productCode", required = false, defaultValue = "") String productCode,
            @RequestParam(name = "colorName", required = false, defaultValue = "") String colorName,
            @RequestParam(name = "typeName", required = false, defaultValue = "") String typeName,
            @RequestParam(name = "materialName", required = false, defaultValue = "") String materialName,
            @RequestParam(name = "sizeName", required = false, defaultValue = "") String sizeName,
            @RequestParam(name = "brandName", required = false, defaultValue = "") String brandName,
            @RequestParam(name = "compartmentName", required = false, defaultValue = "") String compartmentName,
            @RequestParam(name = "producerName", required = false, defaultValue = "") String producerName,
            @RequestParam(name = "buckleTypeName", required = false, defaultValue = "") String buckleTypeName,
            @RequestParam(name = "productDetailDescribe", required = false, defaultValue = "") String productDetailDescribe,
            @RequestParam(name = "minProductDetailAmount", required = false ) Integer minProductDetailAmount,
            @RequestParam(name = "maxProductDetailAmount", required = false ) Integer maxProductDetailAmount,
            @RequestParam(name = "minImportPrice", required = false ) Integer minImportPrice,
            @RequestParam(name = "maxImportPrice", required = false ) Integer maxImportPrice,
            @RequestParam(name = "minRetailPrice", required = false ) Integer minRetailPrice,
            @RequestParam(name = "maxRetailPrice", required = false ) Integer maxRetailPrice,
            @RequestParam(name = "productDetailStatus", required = false,  defaultValue = "") Integer productDetailStatus,
            @RequestParam(defaultValue = "") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
    ) {
        if (pageNum == null || pageSize == null) {
            return new ResponseEntity<>
                    (this.productDetailService.findAll(), HttpStatus.OK);
        }
        Page<ProductDetailDTO> productPage = productDetailService.findAllPagination(
                pageNum,
                pageSize,
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
                sortList,
                sortOrder.toString()
        );

        return new ResponseEntity<>
                (productPage, HttpStatus.OK);
    }



    //add
    @RequestMapping(value = "/product-details", method = RequestMethod.POST)
    public ResponseEntity<?> save(@Valid @RequestBody ProductDetailDTO productDetailDTO) {
        System.out.println(productDetailDTO);
        return new ResponseEntity<>(
                productDetailService.save(productDetailDTO)
                , HttpStatus.OK);
    }

//    //update
    @RequestMapping(value = "/product-details/update-status", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@RequestParam String productDetailId, @RequestParam int status) {
        return new ResponseEntity<>(
                productDetailService.updateStatus(productDetailId, status)
                , HttpStatus.OK);
    }

//
//    //delete
    @RequestMapping(value = "/product-details", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@RequestParam String productDetailId) {
        productDetailService.delete(productDetailId);
        return new ResponseEntity<>("Delete successfully!", HttpStatus.OK);
    }
//
    @RequestMapping(value = "product-detail/{productCode}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllbyproduct(@PathVariable String productCode) {
        return new ResponseEntity<>(
                this.productDetailService.findAllByProductCode(productCode)
                        .stream()
                        .map(productDetail -> modelMapper.map(productDetail, ProductDetailDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK
        );


    }
    @RequestMapping(value = "product-detail/getProductDetailsByProductId/{productId}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllbyproductId(@PathVariable String productId) {
        return new ResponseEntity<>(
                this.productDetailService.findAllByProductId(productId)
                        .stream()
                        .map(productDetail -> modelMapper.map(productDetail, ProductDetailDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK
        );

    }
//
//

    @RequestMapping(value = "/product-details/search", method = RequestMethod.GET)
    public ResponseEntity<?> findByKeyword(@RequestParam String keyword) {
        return new ResponseEntity<>(
                this.productDetailService.findByKeyword(keyword).stream()
                        .map(productDetail -> modelMapper.map(productDetail, ProductDetailDTO.class))
                        .collect(Collectors.toList())
                , HttpStatus.OK);

    }

        @RequestMapping(value = "/product-detail/update-amount", method = RequestMethod.POST)
        public ResponseEntity<?> updateAmount(
                @RequestParam @NotNull String productDetailId,
                @RequestParam @NotNull Integer amount) {
            ProductDetails productDetails = this.productDetailService.findById(productDetailId);


            if(productDetails.getProductDetailAmount() < amount) {

                return  new ResponseEntity<>( "Số lượng update không hợp lệ!!!"
                        , HttpStatus.CONFLICT);
            }
            int newAmount = productDetails.getProductDetailAmount()-amount;
            productDetails.setProductDetailAmount(newAmount);

            if(productDetails.getProductDetailAmount() == 0 ){
                productDetails.setProductDetailStatus(0);
            }
            return new ResponseEntity<>(
                    modelMapper.map(this.productDetailService.save(modelMapper.map(productDetails, ProductDetailDTO.class)), ProductDetailDTO.class)
                    , HttpStatus.OK);
        }
}
