import importlib.util
import json
from pathlib import Path


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
        print(f"========== Case {i} ==========")
        print(f"Input: {case["input"]}")
        print(f"Output: {result}\n")

    return True


if __name__ == "__main__":
    success = run_tests()
    raise SystemExit(0 if success else 1)
