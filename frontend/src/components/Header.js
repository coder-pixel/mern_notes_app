import React from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logout } from "../helper-methods";
import { useDispatch, useSelector } from "react-redux";

function Header({ setSearch }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state?.user?.userInfo);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Link to="/">
          <Navbar.Brand>Note Zipper</Navbar.Brand>
        </Link>

        {userInfo ? (
          <>
            <Nav className="m-auto">
              {
                <Form inline>
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form>
              }
            </Nav>
            <Nav className="customNavbar">
              <NavLink to="/mynotes">My Notes</NavLink>
              <NavLink to="/profile">
                <img
                  alt=""
                  src={userInfo?.pic}
                  width="25"
                  height="25"
                  style={{ marginRight: 10, borderRadius: "50%" }}
                />
                {userInfo?.name}
              </NavLink>

              <Button onClick={() => logout(history)}>Logout</Button>
            </Nav>
          </>
        ) : null}
      </Container>
    </Navbar>
  );
}

export default Header;
