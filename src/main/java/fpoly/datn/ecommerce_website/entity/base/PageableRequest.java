package fpoly.datn.ecommerce_website.entity.base;

import fpoly.datn.ecommerce_website.infrastructure.constant.PaginationConstant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageableRequest {

    private int page = PaginationConstant.DEFAULT_PAGE;
    private int size = PaginationConstant.DEFAULT_SIZE;
}

