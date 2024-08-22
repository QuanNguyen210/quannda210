package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.CompartmentDTO;
import fpoly.datn.ecommerce_website.entity.Compartments;
import fpoly.datn.ecommerce_website.entity.Materials;
import fpoly.datn.ecommerce_website.service.CompartmentService;
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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CompartmentRestController {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CompartmentService compartmentService;

    //hien thi
    @RequestMapping(value = "/compartment/", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() {
        List<Compartments> materialsList =  this.compartmentService.findAll();
        List<Compartments> filtered = materialsList.stream()
                .filter(color -> color.getCompartmentStatus() == 1)
                .collect(Collectors.toList());
        return new ResponseEntity<>(
               filtered
                , HttpStatus.OK);
    }

    //Phan trang
    @RequestMapping(value = "/compartment/pagination", method = RequestMethod.GET)
    public ResponseEntity<?> phanTrang(@RequestParam(name = "page", defaultValue = "0") int pageNum,
                                       @RequestParam(name = "size", defaultValue = "15") int pageSize){
        return ResponseEntity.ok(compartmentService.findAllPagination(pageNum, pageSize));
    }

    //getOne
    @RequestMapping(value = "/compartment", method = RequestMethod.GET)
    public ResponseEntity<CompartmentDTO> getOne(@RequestParam String id) {

        return new ResponseEntity<>(
                modelMapper.map(this.compartmentService.findById(id), CompartmentDTO.class)
                , HttpStatus.OK);
    }

    //add
    @RequestMapping(value = "/compartment", method = RequestMethod.POST)
    public ResponseEntity<?> add(@RequestBody @Valid CompartmentDTO compartmentDTO
    ) {
        return new ResponseEntity<>(
                compartmentService.save(
                        modelMapper.map(compartmentDTO, Compartments.class))
                , HttpStatus.OK);


    }

    //update
    @RequestMapping(value = "/compartment", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@Valid @RequestParam String id, @RequestBody CompartmentDTO compartmentDTO) {
        Compartments compartments = modelMapper.map(compartmentDTO, Compartments.class);
        compartments.setCompartmentId(id);
        return new ResponseEntity<>(
                this.compartmentService.update(id,compartments)
                , HttpStatus.OK);
    }

    @RequestMapping(value = "/compartment/update-status", method = RequestMethod.PUT)
    public ResponseEntity<Compartments> updateStatus(@Valid @RequestParam String id, @RequestParam int status) {
        return new ResponseEntity<>(compartmentService.updateStatus(id, status),
                HttpStatus.OK);

    }

    //delete
    @RequestMapping(value = "/compartment", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@RequestParam("id") String id) {
        compartmentService.delete(compartmentService.findById(id).getCompartmentId());
        return new ResponseEntity<>("Delete Successfully!!!!!!", HttpStatus.OK);
    }

}
