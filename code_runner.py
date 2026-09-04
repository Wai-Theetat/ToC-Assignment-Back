import importlib.util
import json
from pathlib import Path


RESET = "\033[0m"
CYAN = "\033[36m"
BLUE = "\033[34m"
GREEN = "\033[32m"
RED = "\033[31m"


def load_assignment_module():
    root = Path(__file__).resolve().parent
    module_path = root / "TOC_assignment.py"
    spec = importlib.util.spec_from_file_location("TOC_assignment", module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load module from {module_path}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_tests():
    module = load_assignment_module()
    root = Path(__file__).resolve().parent
    testcases_path = root / "testcase.json"

    with testcases_path.open("r", encoding="utf-8") as handle:
        testcases = json.load(handle)["cases"]

    for i, case in enumerate(testcases, start=1):
        result = module.main(case["input"])
        print(f"{CYAN}{'=' * 34} Case {i} {'=' * 53}{RESET}")
        print(f"{BLUE}Test : {case['tests']}{RESET}")
        print(f"{BLUE}Input: {case['input']}{RESET}")
        print(f"{CYAN}{'=' * 97}{RESET}")
        print(f"{BLUE}Expect_Output: {case['expected_output']}{RESET}")
        print(f"{BLUE}Actual_Output: {result}{RESET}\n")
        print(f"{CYAN}{'=' * 97}{RESET}")
        if result != case["expected_output"]:
            print(f"{RED}Test case {i} failed.{RESET}")
        else:
            print(f"{GREEN}Test case {i} passed.{RESET}")
        print(f"{CYAN}{'=' * 97}{RESET}")
    return True


if __name__ == "__main__":
    success = run_tests()
    raise SystemExit(0 if success else 1)
