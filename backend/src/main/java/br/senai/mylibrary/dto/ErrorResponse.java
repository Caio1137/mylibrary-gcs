package br.senai.mylibrary.dto;

import java.util.List;

public record ErrorResponse(
        String message,
        List<String> errors
) {
}
