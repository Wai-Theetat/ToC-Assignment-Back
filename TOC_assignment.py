import re

def main(text_log: str):
    try:
        match = re.search(r'(.*?) DOB:(.*)', text_log, re.DOTALL)

        part1 = match.group(1)
        part2 = match.group(2)

        part2_split = re.search(r'(.*?) Address: (.*)', part2, re.DOTALL)

        date_of_birth = part2_split.group(1)
        address = part2_split.group(2)

        credit_card, email, tel = part1.split(' ')
        return f"{censor_credit_card(credit_card)} {censor_email(email)} {censor_tel(tel)} {censor_DOB(date_of_birth)} {censor_address(address)}"
    except:
        return "Invalid input format"


def censor_credit_card(credit_card):
    newFormat = re.sub(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', r'XXXX-XXXX-XXXX-\3', credit_card)
    return f"{newFormat}"

def censor_tel(tel):
    newFormat = re.sub(r'(\d{3})-(\d{3})-(\d{4})', r'XXX-XXX-\3', tel)
    return f"{newFormat}"

def censor_email(email):
    
    def mask_email(match):
        first = match.group(1)
        middle = match.group(2)
        last = match.group(3)
        return first + '*' * len(middle) + last
    
    newformat = re.sub(r'^(\w)(.*?)(\w)(?=@)', mask_email, email)
    return newformat

def censor_DOB(DOB):
    newFormat = re.sub(r'(\d{2})/(\d{2})/(\d{2})(\d+)', r'XX/XX/\3XX', DOB)
    return f"DOB:{newFormat}"

def censor_address(address):
    def mask_digits(match):
        return 'X' * len(match.group())
    
    newformat = re.sub(r'\d+', mask_digits, address, count=1)
    return f"Address: {newformat}"


if __name__ == "__main__":
    #handle input
    text_log : str = "1234-5678-9012-3456 somchai.d@company.com 093-245-7894 DOB:25/12/2549 Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลำดกระบัง กรุงเทพฯ"
    result = main(text_log)
    print(result)