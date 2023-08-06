// Mozilla Public License 2.0 ©️ 2023 Workoelho.

package sanitization

import (
	"testing"
)

func TestCollapse(t *testing.T) {
	if Collapse("lorem   ipsum\ndolor\t sit\r\n amet") != "lorem ipsum dolor sit amet" {
		t.Error("expected collapse to work")
	}
}

func TestTrim(t *testing.T) {
	if Trim("\t\r\n lorem ipsum dolor sit amet \n \t") != "lorem ipsum dolor sit amet" {
		t.Error("expected trim to work")
	}
}

func TestCondense(t *testing.T) {
	if Condense("\t\r\n lorem   ipsum\ndolor\t sit\r\n amet \n \t") != "lorem ipsum dolor sit amet" {
		t.Error("expected condense to work")
	}
}

func TestLower(t *testing.T) {
	if Lower("Lorem Ipsum") != "lorem ipsum" {
		t.Error("expected lower to work")
	}
}

func TestTitle(t *testing.T) {
	if Title("lorem ipsum dolor sit amet") != "Lorem Ipsum Dolor Sit Amet" {
		t.Error("expected title to work")
	}
}

func TestUpper(t *testing.T) {
	if Upper("Lorem Ipsum") != "LOREM IPSUM" {
		t.Error("expected upper to work")
	}
}
