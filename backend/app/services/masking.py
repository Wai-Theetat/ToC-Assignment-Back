import re


def mask_credit_card(credit_card: str) -> str:
    return re.sub(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', r'XXXX-XXXX-XXXX-\4', credit_card)


def mask_tel(tel: str) -> str:
    return re.sub(r'(\d{3})-(\d{3})-(\d{4})', r'XXX-XXX-\3', tel)


def mask_email(email: str) -> str:
    def _replace(match):
        first = match.group(1)
        middle = match.group(2)
        last = match.group(3)
        return first + '*' * len(middle) + last

    return re.sub(r'^(\w)(.*?)(\w)(?=@)', _replace, email)


def mask_dob(dob: str) -> str:
    def _replace(match):
        third = match.group(3)
        fourth = match.group(4)
        return f"XX/XX/{third}{'X' * len(fourth)}"

    return re.sub(r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)', _replace, dob)


def mask_address(address: str) -> str:
    def _replace(match):
        return re.sub(r'\d', 'X', match.group())

    return re.sub(r'\d+(?:/\d+)?', _replace, address, count=1)
