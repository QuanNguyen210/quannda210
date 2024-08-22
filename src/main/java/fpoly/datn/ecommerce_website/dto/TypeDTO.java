package fpoly.datn.ecommerce_website.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder

public class TypeDTO {

    private String typeId;

    @NotBlank
    private String typeCode;

    @NotBlank
    private String typeName;

    private Integer typeStatus;
}
